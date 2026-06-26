import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { posix } from "node:path";
import { courseDirectoryToRouteSegment, courseSections } from "../course.config";

const SITE_TITLE = "Dynamics & Control";
const SITE_URL = "https://cateds.github.io/Dynamics-Control.md/";
const SITE_DESCRIPTION =
  "Lecture notes for Dynamics & Control (DC) course @ 2025-2026 Spring, Glasgow College, UESTC.";
const GITHUB_URL = "https://github.com/Cateds/Dynamics-Control.md";
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Cateds/Dynamics-Control.md/main/";

const DOCS_DIR = "src/content/docs";
const INDEX_FILE = "index.md";
const DOC_EXTENSIONS = new Set([".md", ".mdx"]);

interface SourceDoc {
  title: string;
  description?: string;
  sourceRelPath: string;
  sourceRelDir: string;
  repositoryPath: string;
  pageUrl: string;
  body: string;
  kind: "home" | "course";
  sectionLabel?: string;
}

interface GenerateLlmsOptions {
  root?: string;
  log?: (message: string) => void;
}

export interface LlmsFile {
  fileName: "llms.txt" | "llms-full.txt";
  content: string;
}

export interface GenerateLlmsResult {
  sourceFiles: string[];
  files: LlmsFile[];
}

interface WriteLlmsOptions extends GenerateLlmsOptions {
  outDir?: string;
}

export interface WriteLlmsResult extends GenerateLlmsResult {
  outputFiles: string[];
}

export function buildLlmsFiles(options: GenerateLlmsOptions = {}): GenerateLlmsResult {
  const root = resolve(options.root ?? process.cwd());
  const docsDir = join(root, DOCS_DIR);
  const docs = readSourceDocs(root, docsDir);

  return {
    sourceFiles: docs.map((doc) => join(root, doc.repositoryPath)),
    files: [
      { fileName: "llms.txt", content: buildLlmsIndex(docs) },
      { fileName: "llms-full.txt", content: buildLlmsFull(docs) },
    ],
  };
}

export function writeLlmsFiles(options: WriteLlmsOptions = {}): WriteLlmsResult {
  const root = resolve(options.root ?? process.cwd());
  const outDir = resolve(root, options.outDir ?? "dist");
  const result = buildLlmsFiles({ root });

  mkdirSync(outDir, { recursive: true });

  const outputFiles = result.files.map((file) => {
    const outputPath = join(outDir, file.fileName);
    writeFileSync(outputPath, file.content, "utf-8");
    return outputPath;
  });

  options.log?.(`Generated ${outputFiles.map((file) => toProjectPath(root, file)).join(" and ")}`);

  return { ...result, outputFiles };
}

export function isLlmsSourcePath(filePath: string, root = process.cwd()): boolean {
  const rel = toPosixPath(relative(resolve(root), resolve(filePath)));

  if (rel === "course.config.ts") return true;
  if (!rel.startsWith(`${DOCS_DIR}/`)) return false;

  return DOC_EXTENSIONS.has(posix.extname(rel));
}

function readSourceDocs(root: string, docsDir: string): SourceDoc[] {
  const docs: SourceDoc[] = [];
  const indexPath = join(docsDir, INDEX_FILE);

  if (existsSync(indexPath)) {
    docs.push(readDoc(root, docsDir, INDEX_FILE, "home"));
  }

  for (const section of courseSections.filter((section) => section.showInPdf)) {
    const sectionDir = join(docsDir, section.directory);
    if (!existsSync(sectionDir)) continue;

    const files = readDocFiles(sectionDir)
      .map((file) => toPosixPath(relative(docsDir, file)))
      .sort(naturalCompare);

    for (const file of files) {
      docs.push(readDoc(root, docsDir, file, "course", section.label));
    }
  }

  return docs;
}

function readDocFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...readDocFiles(fullPath));
      continue;
    }

    if (entry.isFile() && DOC_EXTENSIONS.has(posix.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function readDoc(
  root: string,
  docsDir: string,
  sourceRelPath: string,
  kind: SourceDoc["kind"],
  sectionLabel?: string,
): SourceDoc {
  const fullPath = join(docsDir, sourceRelPath);
  const raw = readFileSync(fullPath, "utf-8");
  const frontmatter = readFrontmatter(raw);
  const body = stripFrontmatter(raw).trim();
  const title = extractTitle(frontmatter, body, fallbackTitle(sourceRelPath));
  const sourceRelDir = toPosixPath(dirname(sourceRelPath));
  const normalizedSourceRelDir = sourceRelDir === "." ? "" : sourceRelDir;
  const repositoryPath = toPosixPath(relative(root, fullPath));

  return {
    title,
    description: frontmatter.description,
    sourceRelPath,
    sourceRelDir: normalizedSourceRelDir,
    repositoryPath,
    pageUrl: pageUrlFor(sourceRelPath),
    body: rewriteMarkdownUrls(body, root, dirname(fullPath), normalizedSourceRelDir),
    kind,
    sectionLabel,
  };
}

function buildLlmsIndex(docs: SourceDoc[]): string {
  const courseDocs = docs.filter((doc) => doc.kind === "course");
  const sections = groupBySection(courseDocs);
  const lines = [
    `# ${SITE_TITLE}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "This site contains Chinese lecture notes and tutorial material for a Dynamics & Control course. It is published with Astro Starlight and includes equations, Markdown tables, and linked figures.",
    "",
    "For LLM tools, use the full context file when you need a single source containing all current lecture Markdown. The full file preserves LaTeX and rewrites local document links to absolute course URLs, while local asset links point to the source repository. It does not transcribe image contents.",
    "",
    "## LLM Sources",
    "",
    `- [Full NotebookLM context](${siteUrlFor("llms-full.txt")}): Generated full-text source containing the homepage and all course Markdown files. Use this as the main NotebookLM reference source.`,
    `- [Course website](${SITE_URL}): Human-readable Astro Starlight version of the same course notes.`,
    `- [GitHub repository](${GITHUB_URL}): Source repository for these notes.`,
    "",
    "## Course Notes",
    "",
  ];

  for (const [sectionLabel, sectionDocs] of sections) {
    lines.push(`### ${sectionLabel}`, "");
    lines.push(
      ...sectionDocs.map((doc) => {
        const description = doc.description ? ` ${doc.description}` : "";
        return `- [${doc.title}](${doc.pageUrl}): Human-readable page included in the full LLM context file.${description}`;
      }),
      "",
    );
  }

  return lines.join("\n");
}

function buildLlmsFull(docs: SourceDoc[]): string {
  const lines = [
    `# ${SITE_TITLE}: Full LLM Context`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Source website: ${SITE_URL}`,
    `LLM index: ${siteUrlFor("llms.txt")}`,
    `Source repository: ${GITHUB_URL}`,
    "",
    "This generated file is intended for NotebookLM or other tools that prefer a single reference source. It contains the homepage body and all course Markdown files in source order. Local Markdown document links have been rewritten to absolute course URLs, and local asset links have been rewritten to raw GitHub source URLs where possible. Each source document starts at an H2 heading so horizontal rules in the original notes remain ordinary content.",
    "",
    "## Contents",
    "",
    ...docs.map((doc) => `- [${doc.title}](${doc.pageUrl})`),
    "",
  ];

  for (const doc of docs) {
    lines.push(...buildFullDocSection(doc), "");
  }

  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function buildFullDocSection(doc: SourceDoc): string[] {
  const body = demoteMarkdownHeadings(removeLeadingH1(doc.body)).trim();
  const lines = [
    `## ${doc.title}`,
    "",
    `Source: ${doc.pageUrl}`,
    `Repository path: ${doc.repositoryPath}`,
  ];

  if (body) {
    lines.push("", body);
  }

  return lines;
}

function groupBySection(docs: SourceDoc[]): Map<string, SourceDoc[]> {
  const groups = new Map<string, SourceDoc[]>();

  for (const doc of docs) {
    const sectionLabel = doc.sectionLabel ?? "Course Notes";
    const group = groups.get(sectionLabel) ?? [];
    group.push(doc);
    groups.set(sectionLabel, group);
  }

  return groups;
}

function readFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {};

  const values: Record<string, string> = {};

  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.+?)\s*$/);
    if (!field) continue;

    const [, key, rawValue] = field;
    values[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

function stripFrontmatter(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function extractTitle(frontmatter: Record<string, string>, body: string, fallback: string): string {
  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return frontmatter.title || h1 || fallback;
}

function fallbackTitle(sourceRelPath: string): string {
  return basename(sourceRelPath, posix.extname(sourceRelPath));
}

function rewriteMarkdownUrls(
  markdown: string,
  root: string,
  sourceDirectory: string,
  sourceRelDir: string,
): string {
  return markdown.replace(
    /(!?\[[^\]\n]*\]\()([^\)\n]+)(\))/g,
    (_match, prefix: string, rawTarget: string, suffix: string) => {
      const target = rawTarget.trim();
      const parsed = target.match(/^(\S+)(\s+.+)?$/);
      if (!parsed) return `${prefix}${rawTarget}${suffix}`;

      const url = parsed[1];
      const title = parsed[2] ?? "";
      const resolvedUrl = resolveMarkdownUrl(url, root, sourceDirectory, sourceRelDir);
      return `${prefix}${resolvedUrl}${title}${suffix}`;
    },
  );
}

function resolveMarkdownUrl(
  url: string,
  root: string,
  sourceDirectory: string,
  sourceRelDir: string,
): string {
  if (/^(https?:|mailto:|data:|#)/i.test(url)) return url;

  const { pathPart, suffix } = splitUrlSuffix(url);
  if (!pathPart) return url;

  if (pathPart.startsWith("/")) {
    return siteUrlFor(pathPart.replace(/^\/Dynamics-Control\.md\/?/, "")) + suffix;
  }

  const normalizedDocPath = posix.normalize(posix.join(sourceRelDir, pathPart));
  if (isMarkdownPath(normalizedDocPath)) {
    return pageUrlFor(normalizedDocPath) + suffix;
  }

  const absoluteTargetPath = resolve(sourceDirectory, pathPart);
  const repositoryPath = toPosixPath(relative(root, absoluteTargetPath));

  if (!repositoryPath.startsWith("..") && existsSync(absoluteTargetPath)) {
    return rawGitHubUrlFor(repositoryPath) + suffix;
  }

  return siteUrlFor(normalizedDocPath) + suffix;
}

function splitUrlSuffix(url: string): { pathPart: string; suffix: string } {
  let pathPart = url;
  let hash = "";
  let search = "";

  const hashIndex = pathPart.indexOf("#");
  if (hashIndex !== -1) {
    hash = pathPart.slice(hashIndex);
    pathPart = pathPart.slice(0, hashIndex);
  }

  const searchIndex = pathPart.indexOf("?");
  if (searchIndex !== -1) {
    search = pathPart.slice(searchIndex);
    pathPart = pathPart.slice(0, searchIndex);
  }

  return { pathPart, suffix: `${search}${hash}` };
}

function removeLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+.+(?:\r?\n|$)/, "").trimStart();
}

function demoteMarkdownHeadings(markdown: string): string {
  let inFence = false;
  let fenceChar = "";
  let fenceLength = 0;

  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const fence = line.match(/^(\s{0,3})(`{3,}|~{3,})/);
      if (fence) {
        const marker = fence[2];
        const char = marker[0];

        if (!inFence) {
          inFence = true;
          fenceChar = char;
          fenceLength = marker.length;
        } else if (char === fenceChar && marker.length >= fenceLength) {
          inFence = false;
        }

        return line;
      }

      if (inFence) return line;
      return line.replace(/^(\s{0,3})(#{1,5})(\s+)/, "$1#$2$3");
    })
    .join("\n");
}

function pageUrlFor(sourceRelPath: string): string {
  if (sourceRelPath === INDEX_FILE) return SITE_URL;

  const routePath = sourceRelPath
    .replace(/\.[^.]+$/, "")
    .split("/")
    .filter(Boolean)
    .map(routeSegmentFor)
    .join("/")
    .replace(/(^|\/)index$/, "");

  return siteUrlFor(routePath ? `${routePath}/` : "");
}

function routeSegmentFor(segment: string): string {
  const section = courseSections.find((candidate) => candidate.directory === segment);
  if (section) return courseDirectoryToRouteSegment(section.directory);

  return segment
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s_-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function siteUrlFor(relPath: string): string {
  return new URL(relPath.split("/").map(encodeURIComponent).join("/"), SITE_URL).toString();
}

function rawGitHubUrlFor(repositoryPath: string): string {
  return new URL(
    repositoryPath.split("/").map(encodeURIComponent).join("/"),
    GITHUB_RAW_URL,
  ).toString();
}

function isMarkdownPath(filePath: string): boolean {
  return DOC_EXTENSIONS.has(posix.extname(filePath));
}

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
}

function toProjectPath(root: string, filePath: string): string {
  return toPosixPath(filePath.slice(root.length + 1));
}

function toPosixPath(filePath: string): string {
  return filePath.split(sep).join("/");
}

function readArgValue(name: string): string | undefined {
  const prefix = `${name}=`;

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === name) return process.argv[i + 1]?.trim();
    if (arg.startsWith(prefix)) return arg.slice(prefix.length).trim();
  }
}

function main() {
  writeLlmsFiles({
    root: readArgValue("--root"),
    outDir: readArgValue("--outDir"),
    log: (message) => console.log(message),
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
