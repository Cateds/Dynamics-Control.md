# starlight-relative-doc-links

本地 Starlight 插件，用于将相对 Markdown 文档链接重写为最终的 Starlight 路由。

## 为什么需要这个插件

Starlight 插件可以通过 `config:setup` 扩展设置，Astro 集成可以在 `astro:config:setup` 期间追加 `markdown.remarkPlugins`。

本插件利用这一官方扩展路径，让你可以像这样编写链接：

- `./example.md`
- `./Test-3_Extreme@%20Plan.md`

并将其重写为实际生成的路由：

- `/reference/example/`
- `/reference/test-3_extreme-plan/`

## 功能特性

- `.md`、`.mdx`、`.mdoc` 及常见 Markdown 扩展名
- URL 编码的文件名
- 空格、大写字母和特殊字符
- frontmatter 中的 `slug`
- 目录链接，如 `./foo/` -> `./foo/index.md`
- `?query` 和 `#hash`
- `index.md` -> 目录路由

## 配置说明

- 在 `astro.config.mjs` 中注册 Starlight 插件

  ```ts
  import starlightRelativeDocLinks, {
    createStarlightDocsGenerateId,
  } from "./plugin/starlight-relative-doc-links/index.mts";

  export default defineConfig({
    integrations: [
      starlight({
        plugins: [starlightRelativeDocLinks({ generateId: docsGenerateId })],
      }),
    ],
  });
  ```

- 在 `src/content.config.ts` 中复用相同的 `generateId`

  ```ts
  import { createStarlightDocsGenerateId } from "../plugin/starlight-relative-doc-links/index.mts";

  const docsGenerateId = createStarlightDocsGenerateId();

  export const collections = {
    docs: defineCollection({
      loader: docsLoader({ generateId: docsGenerateId }),
      schema: docsSchema(),
    }),
  };
  ```

保持两端使用相同的 `generateId` 可以避免生成的文档 ID 与重写的 Markdown 链接之间的路由偏差。
