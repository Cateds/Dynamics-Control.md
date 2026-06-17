// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightRelativeDocLinks, {
  createStarlightDocsGenerateId,
} from "./plugin/starlight-relative-doc-links/index.mts";
import starlightAnthropicTheme from "./plugin/starlight-anthropic-theme/index.mts";
import { starlightKatex } from "starlight-katex";

const docsGenerateId = createStarlightDocsGenerateId();

// https://astro.build/config
export default defineConfig({
  site: "https://cateds.github.io",
  base: "/Dynamics-Control.md",
  integrations: [
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
      ],
      sidebar: [
        {
          label: "Preface",
          autogenerate: { directory: "preface" },
        },
        {
          label: "Part.1",
          autogenerate: { directory: "part.1" },
        },
        {
          label: "Part.2",
          autogenerate: { directory: "part.2" },
        }
      ],
      lastUpdated: true,
      plugins: [
        starlightRelativeDocLinks({ generateId: docsGenerateId }),
        starlightKatex(),
        starlightAnthropicTheme(),
      ],
    }),
  ],
});
