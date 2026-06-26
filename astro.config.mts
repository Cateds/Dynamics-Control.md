// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightRelativeDocLinks, {
  createStarlightDocsGenerateId,
} from "./plugin/starlight-relative-doc-links/index.mts";
import starlightAnthropicTheme from "./plugin/starlight-anthropic-theme/index.mts";
import { starlightKatex } from "starlight-katex";
import { courseSections } from "./course.config";

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
