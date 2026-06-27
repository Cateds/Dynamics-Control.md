import { type ArticleData } from "./build-html";

function normalizePath(p: string): string {
  return p.replace(/\/+$/, "") || "/";
}

function stripIndexHtml(p: string): string {
  return p.replace(/\/index\.html$/, "");
}

function toRoutePath(path: string): string {
  return path
    .replace(/\.md$/i, "")
    .split("/")
    .map((seg) => seg.replace(/\./g, ""))
    .join("/");
}

export function rewriteInternalLinks(articles: ArticleData[], pathPrefix: string): ArticleData[] {
  const pathToIndex = new Map<string, number>();
  for (let i = 0; i < articles.length; i++) {
    const p = normalizePath(articles[i].path);
    const pStripped = stripIndexHtml(p);
    pathToIndex.set(p, i);
    pathToIndex.set(pStripped, i);
    pathToIndex.set(pStripped + "/", i);
    pathToIndex.set(pathPrefix + pStripped, i);
    pathToIndex.set(pathPrefix + pStripped + "/", i);
  }

  for (let i = 0; i < articles.length; i++) {
    let content = articles[i].content;
    const basePath = stripIndexHtml(articles[i].path);

    content = content.replace(
      /<(h[1-6])\b([^>]*?)\sid="([^"]*)"/gi,
      (_m: string, tag: string, before: string, id: string) =>
        `<${tag}${before} id="page-${i}--${id}"`,
    );

    content = content.replace(/\shref="([^"]*)"/gi, (_m: string, rawHref: string) => {
      const newHref = resolveHref(rawHref, basePath, pathPrefix, pathToIndex, i);
      return ` href="${newHref}"`;
    });

    articles[i].content = content;
  }
  return articles;
}

function resolveRelative(base: string, rel: string): string {
  if (!rel || rel === ".") return base;
  if (rel.startsWith("/")) return rel;

  const baseDir = base.substring(0, base.lastIndexOf("/") + 1);
  const parts = baseDir.split("/").filter(Boolean);

  for (const seg of rel.split("/")) {
    if (seg === "..") {
      parts.pop();
    } else if (seg && seg !== ".") {
      parts.push(seg);
    }
  }

  return "/" + parts.join("/");
}

function resolveHref(
  rawHref: string,
  basePath: string,
  pathPrefix: string,
  pathToIndex: Map<string, number>,
  currentArticleIndex: number,
): string {
  if (
    rawHref.startsWith("http://") ||
    rawHref.startsWith("https://") ||
    rawHref.startsWith("mailto:") ||
    rawHref.startsWith("data:")
  ) {
    return rawHref;
  }

  if (rawHref.startsWith("#") && !rawHref.startsWith("#page-")) {
    return `#page-${currentArticleIndex}--${rawHref.slice(1)}`;
  }

  if (/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|ico|pdf|zip|webp)$/i.test(rawHref)) {
    return rawHref;
  }

  const hashIdx = rawHref.indexOf("#");
  const relPath = hashIdx >= 0 ? rawHref.slice(0, hashIdx) : rawHref;
  const fragment = hashIdx >= 0 ? rawHref.slice(hashIdx + 1) : "";

  let resolved = resolveRelative(basePath, relPath);

  if (resolved.startsWith(pathPrefix)) {
    resolved = resolved.slice(pathPrefix.length);
  }

  resolved = toRoutePath(resolved);

  const pageIndex = pathToIndex.get(resolved) ?? pathToIndex.get(resolved + "/");
  if (pageIndex !== undefined) {
    return fragment ? `#page-${pageIndex}--${fragment}` : `#page-${pageIndex}`;
  }

  return rawHref;
}
