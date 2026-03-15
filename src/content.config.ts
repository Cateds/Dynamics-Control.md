import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { createStarlightDocsGenerateId } from "../plugin/starlight-relative-doc-links/index.mts";

const docsGenerateId = createStarlightDocsGenerateId();

export const collections = {
  docs: defineCollection({
    loader: docsLoader({ generateId: docsGenerateId }),
    schema: docsSchema(),
  }),
};
