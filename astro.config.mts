// @ts-check
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig } from "astro/config";
import type { Plugin, ViteDevServer } from "vite";
import mermaid from "astro-mermaid";
import starlight from "@astrojs/starlight";
import starlightRelativeDocLinks, {
  createStarlightDocsGenerateId,
} from "./plugin/starlight-relative-doc-links/index.mts";
import starlightAnthropicTheme from "./plugin/starlight-anthropic-theme/index.mts";
import { starlightKatex } from "starlight-katex";
import { courseSections } from "./course.config";
import { buildLlmsFiles, isLlmsSourcePath, type LlmsFile } from "./utils/generate-llms";

const docsGenerateId = createStarlightDocsGenerateId();

function llmsDevPlugin(): Plugin {
  let basePath = "";
  let files = new Map<LlmsFile["fileName"], string>();

  function refresh(log: (message: string) => void) {
    const result = buildLlmsFiles();
    files = new Map(result.files.map((file) => [file.fileName, file.content]));
    log(`Generated in-memory ${result.files.map((file) => file.fileName).join(" and ")}`);
  }

  function fileNameFromUrl(rawUrl: string | undefined): LlmsFile["fileName"] | undefined {
    if (!rawUrl) return;

    const pathname = new URL(rawUrl, "http://localhost").pathname;
    const normalizedPath =
      basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
    const fileName = normalizedPath.replace(/^\//, "");

    return fileName === "llms.txt" || fileName === "llms-full.txt" ? fileName : undefined;
  }

  return {
    name: "dynamics-control-llms",
    configResolved(config) {
      basePath = config.base.replace(/\/$/, "");
    },
    configureServer(server: ViteDevServer) {
      refresh((message) => server.config.logger.info(message));
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const fileName = fileNameFromUrl(req.url);
        if (!fileName) return next();

        const content = files.get(fileName);
        if (!content) return next();

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(content);
      });
      server.watcher.add([
        path.resolve(process.cwd(), "src/content/docs"),
        path.resolve(process.cwd(), "course.config.ts"),
      ]);
      server.watcher.on("all", (_event: string, filePath: string) => {
        if (!isLlmsSourcePath(filePath)) return;
        refresh((message) => server.config.logger.info(message));
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://cateds.github.io",
  base: "/Dynamics-Control.md",
  vite: {
    plugins: [llmsDevPlugin()],
  },
  integrations: [
    mermaid({
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        flowchart: {
          curve: "basis",
        },
      },
    }),
    starlight({
      locales: { root: { lang: "zh", label: "中文" } },
      title: "Dynamics & Control",
      components: {
        SocialIcons: "./src/components/SocialIcons.astro",
        Head: "./src/components/Head.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/cateds/dynamics-control.md",
        },
        {
          icon: "open-book",
          label: "StudyHub",
          href: "https://www.study-hub.store/",
        },
        {
          icon: "seti:pdf",
          label: "PDF",
          href: "https://github.com/cateds/dynamics-control.md/releases",
        },
      ],
      sidebar: courseSections.map(({ label, directory }) => ({
        label,
        items: [{ autogenerate: { directory } }],
      })),
      lastUpdated: true,
      plugins: [
        starlightRelativeDocLinks({ generateId: docsGenerateId }),
        starlightKatex(),
        starlightAnthropicTheme(),
      ],
    }),
  ],
});
