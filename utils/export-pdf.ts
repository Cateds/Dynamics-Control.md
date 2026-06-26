import puppeteer from "puppeteer";
import http from "node:http";
import { readFileSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";
import serveHandler from "serve-handler";
import { buildHtml, type ArticleData, type PartDef } from "./build-html";
import { rewriteInternalLinks } from "./rewrite-links";
import { courseDirectoryToRouteSegment, courseSections } from "../course.config";

const CONCURRENCY = 4;
const PUBLIC_DIR = resolve(process.cwd(), "dist");
const SITEMAP_PATH = join(PUBLIC_DIR, "sitemap-0.xml");
const OUTPUT_DIR = resolve(process.cwd(), "pdf-output");
const SITE_TITLE = "Dynamics & Control";
const SITE_URL = "https://cateds.github.io/Dynamics-Control.md/";
const GITHUB_URL = "https://github.com/Cateds/Dynamics-Control.md";
const AUTHOR_URL = "https://cateds.github.io/";
const AUTHOR_NAME = "Cateds";

const PDF_PARTS: PartDef[] = courseSections
  .filter((section) => section.showInPdf)
  .map(({ label, directory }) => ({
    label,
    folder: courseDirectoryToRouteSegment(directory),
  }));
const PDF_FOLDER_ORDER = new Map(PDF_PARTS.map((part, index) => [part.folder, index]));

const SKIP_BUILD = process.argv.includes("--skip-build");
const CI = process.env.CI === "true";
const TAG = resolveReleaseTag();
const OUTPUT_FILE = join(OUTPUT_DIR, "DynamicsControl.pdf");

function readArgValue(name: string) {
  const prefix = `${name}=`;

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === name) return process.argv[i + 1]?.trim();
    if (arg.startsWith(prefix)) return arg.slice(prefix.length).trim();
  }
}

function readLatestGitTag() {
  try {
    return execSync("git tag --sort=-version:refname", {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split(/\r?\n/)
      .map((tag) => tag.trim())
      .find(Boolean);
  } catch {
    return undefined;
  }
}

function resolveReleaseTag() {
  return readArgValue("--tag") || process.env.RELEASE_TAG?.trim() || readLatestGitTag() || "v0.0.0";
}

async function main() {
  if (!SKIP_BUILD) {
    console.log("[1/5] Building site...");
    execSync("bun run build", { stdio: "inherit", cwd: process.cwd() });
  } else {
    console.log("[1/5] Build skipped (dist dir already exists)");
  }
  console.log(`   Release tag: ${TAG}`);

  if (!readFileSync(SITEMAP_PATH, "utf-8").trim()) {
    console.error("Sitemap is empty. Build may have failed.");
    process.exit(1);
  }

  console.log("[2/5] Parsing sitemap...");
  const sitemap = readFileSync(SITEMAP_PATH, "utf-8");
  const urlMatches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
  const allUrls = urlMatches.map((m) => m[1]);

  if (allUrls.length === 0) {
    console.error("No URLs found in sitemap.");
    process.exit(1);
  }

  const urls = allUrls.filter((url) => {
    const pathname = new URL(url).pathname;
    const pathWithoutPrefix = pathname.replace(/^\/Dynamics-Control\.md\/?/, "");
    const folder = pathWithoutPrefix.split("/")[0];

    return (
      pathname !== "/Dynamics-Control.md/" &&
      pathname !== "/Dynamics-Control.md/index.html" &&
      pathname !== "/Dynamics-Control.md" &&
      PDF_FOLDER_ORDER.has(folder)
    );
  });

  const pathPrefix = "/Dynamics-Control.md";
  console.log(
    `   Found ${urls.length} content pages (skipped homepage), path prefix: "${pathPrefix}"`,
  );

  const server = http.createServer((req, res) => {
    serveHandler(req, res, {
      public: PUBLIC_DIR,
      cleanUrls: false,
    });
  });

  const port = await new Promise<number>((resolveP, reject) => {
    server.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === "object") resolveP(addr.port);
      else reject(new Error("Failed to get server port"));
    });
    server.on("error", reject);
  });
  console.log(`[3/5] Local server started on port ${port}`);

  console.log(`[4/5] Extracting page content (${CONCURRENCY} workers)...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: CI ? ["--no-sandbox", "--disable-setuid-sandbox"] : [],
  });
  const articles: ArticleData[] = [];

  try {
    interface Task {
      url: string;
      localPath: string;
    }
    const tasks: Task[] = urls.map((url) => {
      const pathname = new URL(url).pathname;
      let localPath = pathname.replace(pathPrefix, "") || "/";
      if (!localPath.startsWith("/")) localPath = "/" + localPath;
      if (localPath.endsWith("/")) localPath += "index.html";
      return { url, localPath };
    });
    const total = tasks.length;
    let done = 0;

    async function scrapeWorker(workerId: number) {
      let task: Task | undefined;
      while ((task = tasks.shift())) {
        done++;
        const tag = `[${String(done).padStart(2)}/${total}] W${workerId}`;

        const page = await browser.newPage();
        try {
          await page.goto(`http://localhost:${port}${task.localPath}`, {
            waitUntil: "networkidle0",
            timeout: 30000,
          });

          const data = await page.evaluate((prefix: string) => {
            const contentEl = document.querySelector<HTMLElement>(".sl-markdown-content");
            if (!contentEl) return null;

            const clone = contentEl.cloneNode(true) as HTMLElement;

            clone.querySelectorAll("img[src]").forEach((img) => {
              const src = img.getAttribute("src");
              if (src && !src.startsWith("http") && !src.startsWith("data:")) {
                try {
                  const cleanSrc = src.startsWith(prefix) ? src.slice(prefix.length) : src;
                  img.setAttribute("src", cleanSrc);
                } catch {}
              }
              img.removeAttribute("loading");
              img.removeAttribute("decoding");
              img.removeAttribute("width");
              img.removeAttribute("height");
              img.removeAttribute("style");
            });

            clone.querySelectorAll("script").forEach((s) => s.remove());
            clone.querySelectorAll("a.sl-anchor-link").forEach((a) => a.remove());

            clone.querySelectorAll(".sl-heading-wrapper").forEach((wrapper) => {
              const heading = wrapper.querySelector("h1, h2, h3, h4, h5, h6");
              if (heading) {
                wrapper.parentNode?.replaceChild(heading, wrapper);
              }
            });

            clone.querySelectorAll("details").forEach((d) => {
              d.setAttribute("open", "");
            });

            const title =
              document
                .querySelector("h1#_top")
                ?.textContent?.replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
                .trim() ||
              document.title ||
              "";

            return { title, content: clone.innerHTML };
          }, pathPrefix);

          if (data && data.content) {
            const parts = task.localPath.replace(/\/$/, "").split("/").filter(Boolean);
            const folder = parts.length > 0 ? parts[0] : ".";
            const fileName = parts.length > 1 ? parts[parts.length - 1] : "index";
            const sortKey = fileName === "index" ? `${folder}/__00_index` : `${folder}/${fileName}`;

            articles.push({
              path: task.localPath,
              title: data.title,
              content: data.content,
              folder,
              sortKey,
            });
            console.log(`${tag} ${task.localPath} ✓`);
          } else {
            console.log(`${tag} ${task.localPath} (empty)`);
          }
        } catch (err) {
          console.log(`${tag} ${task.localPath} ✗ ${(err as Error).message}`);
        } finally {
          await page.close();
        }
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, (_, i) => scrapeWorker(i + 1));
    await Promise.all(workers);

    articles.sort((a, b) => {
      const sectionOrderA = PDF_FOLDER_ORDER.get(a.folder) ?? Number.MAX_SAFE_INTEGER;
      const sectionOrderB = PDF_FOLDER_ORDER.get(b.folder) ?? Number.MAX_SAFE_INTEGER;

      if (sectionOrderA !== sectionOrderB) return sectionOrderA - sectionOrderB;

      return a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true });
    });
    console.log(`\n   Extracted ${articles.length}/${urls.length} articles.`);

    rewriteInternalLinks(articles, pathPrefix);

    console.log("[5/5] Generating PDF...");
    const html = buildHtml(articles, {
      siteTitle: SITE_TITLE,
      tag: TAG,
      siteUrl: SITE_URL,
      githubUrl: GITHUB_URL,
      authorUrl: AUTHOR_URL,
      authorName: AUTHOR_NAME,
      parts: PDF_PARTS,
    });
    mkdirSync(OUTPUT_DIR, { recursive: true });

    const tempHtmlPath = join(PUBLIC_DIR, "__pdf_render.html");
    writeFileSync(tempHtmlPath, html);

    const pdfPage = await browser.newPage();
    await pdfPage.goto(`http://localhost:${port}/__pdf_render.html`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await new Promise((r) => setTimeout(r, 3000));

    await pdfPage.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(() => resolve(), 5000);
          });
        }),
      );
    });

    await pdfPage.pdf({
      path: OUTPUT_FILE,
      format: "A4",
      printBackground: false,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `<div style="font-size:11px;text-align:center;width:100%;color:#b0aea5;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        - <span class="pageNumber"></span> -
      </div>`,
      margin: {
        top: "2cm",
        bottom: "2cm",
        left: "2cm",
        right: "2cm",
      },
    });

    await pdfPage.close();

    try {
      unlinkSync(tempHtmlPath);
    } catch {}

    const size = (readFileSync(OUTPUT_FILE).byteLength / 1024 / 1024).toFixed(1);
    console.log(`\n✅ PDF saved: ${OUTPUT_FILE} (${size} MB)`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("\nFatal:", err);
  process.exit(1);
});
