import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { slug as githubSlug } from "github-slugger";
import type { Definition, Link, Nodes, Root } from "mdast";
import type { HookParameters, StarlightPlugin } from "@astrojs/starlight/types";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

const DEFAULT_DOC_EXTENSIONS = [
  ".markdown",
  ".mdown",
  ".mkdn",
  ".mkd",
  ".mdwn",
  ".md",
  ".mdx",
  ".mdoc",
] as const;

type FrontmatterData = Record<string, unknown>;

type GenerateIdOptions = {
  entry: string;
  base: URL;
  data: FrontmatterData;
};

type GenerateId = (options: GenerateIdOptions) => string;
type LinkNode = Link | Definition;
type StarlightConfigSetupOptions = HookParameters<"config:setup">;
type AstroConfigSetupHook = NonNullable<AstroIntegration["hooks"]["astro:config:setup"]>;
type AstroConfigSetupOptions = Parameters<AstroConfigSetupHook>[0];

interface RelativeDocLinksPluginOptions {
  generateId?: GenerateId;
  extensions?: readonly string[];
  warnOnMissingTarget?: boolean;
}

interface ResolvedRelativeDocLinksPluginOptions {
  generateId: GenerateId;
  extensions: string[];
  warnOnMissingTarget: boolean;
}

interface RemarkRelativeDocLinksOptions extends ResolvedRelativeDocLinksPluginOptions {
  base: string;
  docsRoot: string;
  docsRootUrl: URL;
  entryDataCache: Map<string, FrontmatterData>;
  logger: AstroIntegrationLogger;
}

const DEFAULT_LINK_NODE_TYPES = new Set<LinkNode["type"]>(["link", "definition"]);

export const starlightDocsGenerateId: GenerateId = ({ entry, data }) => {
  if (typeof data.slug === "string") {
    return data.slug;
  }

  return filePathToDocId(entry);
};

export function createStarlightDocsGenerateId(): GenerateId {
  return starlightDocsGenerateId;
}

export default function starlightRelativeDocLinks(
  options: RelativeDocLinksPluginOptions = {},
): StarlightPlugin {
  const pluginOptions: ResolvedRelativeDocLinksPluginOptions = {
    extensions: [...(options.extensions ?? DEFAULT_DOC_EXTENSIONS)],
    generateId: options.generateId ?? starlightDocsGenerateId,
    warnOnMissingTarget: options.warnOnMissingTarget ?? false,
  };

  return {
    name: "starlight-relative-doc-links",
    hooks: {
      "config:setup"({ addIntegration }: StarlightConfigSetupOptions) {
        addIntegration(createAstroIntegration(pluginOptions));
      },
    },
  };
}

function createAstroIntegration(options: ResolvedRelativeDocLinksPluginOptions): AstroIntegration {
  return {
    name: "starlight-relative-doc-links-integration",
    hooks: {
      "astro:config:setup"({ config, updateConfig, logger }: AstroConfigSetupOptions) {
        const docsRoot = fileURLToPath(new URL("./src/content/docs/", config.root));
        const docsRootUrl = directoryPathToFileUrl(docsRoot);
        const remarkPlugin: [typeof remarkRelativeDocLinks, RemarkRelativeDocLinksOptions] = [
          remarkRelativeDocLinks,
          {
            base: config.base ?? "/",
            docsRoot,
            docsRootUrl,
            entryDataCache: new Map(),
            generateId: options.generateId,
            extensions: options.extensions,
            logger,
            warnOnMissingTarget: options.warnOnMissingTarget,
          },
        ];

        updateConfig({
          markdown: {
            ...(config.markdown ?? {}),
            remarkPlugins: [...(config.markdown?.remarkPlugins ?? []), remarkPlugin],
          },
        });
      },
    },
  };
}

function remarkRelativeDocLinks(options: RemarkRelativeDocLinksOptions) {
  return (tree: Root, file: VFile): void => {
    const sourceFilePath = typeof file.path === "string" ? path.resolve(file.path) : null;

    if (!sourceFilePath || !isInDirectory(sourceFilePath, options.docsRoot)) {
      return;
    }

    visit(tree, (node: Nodes) => {
      if (!isLinkNode(node) || typeof node.url !== "string") {
        return;
      }

      const rewrittenUrl = rewriteDocLink(node.url, sourceFilePath, options);
      if (rewrittenUrl) {
        node.url = rewrittenUrl;
      }
    });
  };
}

function rewriteDocLink(
  rawUrl: string,
  sourceFilePath: string,
  options: RemarkRelativeDocLinksOptions,
): string | null {
  if (!shouldResolveRelativeDocLink(rawUrl)) {
    return null;
  }

  const { pathname, suffix } = splitUrlSuffix(rawUrl);
  const decodedPathname = safeDecodePathname(pathname);
  const sourceDirectory = path.dirname(sourceFilePath);
  const absoluteTargetPath = path.resolve(sourceDirectory, decodedPathname);
  const targetFilePath = resolveDocTargetPath(absoluteTargetPath, options.extensions);

  if (!targetFilePath || !isInDirectory(targetFilePath, options.docsRoot)) {
    if (options.warnOnMissingTarget) {
      options.logger.warn(
        `Could not resolve Markdown doc link "${rawUrl}" from "${path.relative(options.docsRoot, sourceFilePath)}".`,
      );
    }
    return null;
  }

  const entry = normalizeSlashes(path.relative(options.docsRoot, targetFilePath));
  const data = readEntryData(targetFilePath, options.entryDataCache);
  const id = options.generateId({ entry, base: options.docsRootUrl, data });
  const routePath = withBase(options.base, docIdToPathname(id));

  return `${routePath}${suffix}`;
}

function resolveDocTargetPath(
  absoluteTargetPath: string,
  extensions: readonly string[],
): string | null {
  const extension = path.extname(absoluteTargetPath).toLowerCase();

  if (extension) {
    return extensions.includes(extension) && isFile(absoluteTargetPath) ? absoluteTargetPath : null;
  }

  const directFileCandidates = extensions.map(
    (candidateExtension) => `${absoluteTargetPath}${candidateExtension}`,
  );
  const indexFileCandidates = extensions.map((candidateExtension) =>
    path.join(absoluteTargetPath, `index${candidateExtension}`),
  );

  for (const candidate of [...directFileCandidates, ...indexFileCandidates]) {
    if (isFile(candidate)) {
      return candidate;
    }
  }

  return null;
}

function shouldResolveRelativeDocLink(url: string): boolean {
  if (!url || url.startsWith("#") || url.startsWith("/") || url.startsWith("//")) {
    return false;
  }

  return !/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url);
}

function splitUrlSuffix(url: string): { pathname: string; suffix: string } {
  let pathname = url;
  let hash = "";
  let search = "";

  const hashIndex = pathname.indexOf("#");
  if (hashIndex !== -1) {
    hash = pathname.slice(hashIndex);
    pathname = pathname.slice(0, hashIndex);
  }

  const searchIndex = pathname.indexOf("?");
  if (searchIndex !== -1) {
    search = pathname.slice(searchIndex);
    pathname = pathname.slice(0, searchIndex);
  }

  return { pathname, suffix: `${search}${hash}` };
}

function safeDecodePathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function filePathToDocId(filePath: string): string {
  const normalizedPath = normalizeSlashes(filePath).replace(/^\.\//, "");
  const withoutExtension = normalizedPath.replace(/\.[^.]+$/, "");

  return withoutExtension
    .split("/")
    .filter(Boolean)
    .map((segment) => githubSlug(segment))
    .join("/");
}

function docIdToPathname(id: string): string {
  const normalizedId = normalizeRouteId(id);
  return normalizedId ? `/${normalizedId}/` : "/";
}

function normalizeRouteId(id: string): string {
  const normalizedId = normalizeSlashes(id).replace(/^\/+|\/+$/g, "");

  if (!normalizedId || normalizedId === "index") {
    return "";
  }

  return normalizedId.endsWith("/index") ? normalizedId.slice(0, -6) : normalizedId;
}

function withBase(base: string, pathname: string): string {
  const normalizedBase = normalizeBase(base);
  return normalizedBase === "/"
    ? pathname
    : `${normalizedBase}${pathname === "/" ? "/" : pathname}`;
}

function normalizeBase(base: string): string {
  if (!base || base === "/") {
    return "/";
  }

  return `/${base.replace(/^\/+|\/+$/g, "")}`;
}

function isLinkNode(node: Nodes): node is LinkNode {
  return DEFAULT_LINK_NODE_TYPES.has(node.type as LinkNode["type"]);
}

function isInDirectory(targetPath: string, directoryPath: string): boolean {
  const relativePath = path.relative(directoryPath, targetPath);
  return (
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

function isFile(targetPath: string): boolean {
  try {
    return fs.statSync(targetPath).isFile();
  } catch {
    return false;
  }
}

function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, "/");
}

function readEntryData(filePath: string, cache: Map<string, FrontmatterData>): FrontmatterData {
  const cached = cache.get(filePath);
  if (cached) {
    return cached;
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { frontmatter } = parseFrontmatter(source, {
    frontmatter: "empty-with-spaces",
  });
  cache.set(filePath, frontmatter);
  return frontmatter;
}

function directoryPathToFileUrl(directoryPath: string): URL {
  const normalizedDirectoryPath = directoryPath.endsWith(path.sep)
    ? directoryPath
    : `${directoryPath}${path.sep}`;
  return pathToFileURL(normalizedDirectoryPath);
}
