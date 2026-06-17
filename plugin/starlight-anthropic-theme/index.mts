import type { HookParameters, StarlightPlugin } from "@astrojs/starlight/types";

type StarlightConfigSetupOptions = HookParameters<"config:setup">;

export default function starlightAnthropicTheme(): StarlightPlugin {
  return {
    name: "starlight-anthropic-theme",
    hooks: {
      "config:setup"({ config, updateConfig }: StarlightConfigSetupOptions) {
        updateConfig({
          customCss: [...(config.customCss ?? []), "/src/custom.css"],
          components: {
            ...(config.components ?? {}),
            PageTitle: "./src/components/PageTitle.astro",
            ContentPanel: "./src/components/ContentPanel.astro",
            ThemeProvider: "./src/components/ThemeProvider.astro",
            ThemeSelect: "./src/components/ThemeSelect.astro",
          },
        });
      },
    },
  };
}
