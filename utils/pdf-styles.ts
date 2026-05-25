export const PDF_STYLES = `
@page { size: A4; }

* { box-sizing: border-box; margin: 0; padding: 0; }

html {
  --sl-color-white: oklch(21% 0.034 264.665);
  --sl-color-gray-1: oklch(27.8% 0.033 256.848);
  --sl-color-gray-2: oklch(37.3% 0.034 259.733);
  --sl-color-gray-3: oklch(55.1% 0.027 264.364);
  --sl-color-gray-4: oklch(70.7% 0.022 261.325);
  --sl-color-gray-5: oklch(87.2% 0.01 258.338);
  --sl-color-gray-6: oklch(92.8% 0.006 264.531);
  --sl-color-gray-7: oklch(96.7% 0.003 264.542);
  --sl-color-black: #fff;
  --sl-color-accent-low: oklch(92.8% 0.006 264.531);
  --sl-color-accent: oklch(27.8% 0.033 256.848);
  --sl-color-accent-high: oklch(21% 0.034 264.665);
  --sl-color-bg-inline-code: oklch(96.7% 0.003 264.542);
  --sl-color-border-inline-code: oklch(87.2% 0.01 258.338);
  --sl-color-blue-low: oklch(93.2% 0.032 255.585);
  --sl-color-blue: oklch(70.7% 0.165 254.624);
  --sl-color-blue-high: oklch(42.4% 0.199 265.638);
  --sl-color-purple-low: oklch(94.6% 0.033 307.174);
  --sl-color-purple: oklch(71.4% 0.203 305.504);
  --sl-color-purple-high: oklch(43.8% 0.218 303.724);
  --sl-color-orange-low: oklch(96.2% 0.059 95.617);
  --sl-color-orange: oklch(82.8% 0.189 84.429);
  --sl-color-orange-high: oklch(47.3% 0.137 46.201);
  --sl-color-red-low: oklch(93.6% 0.032 17.717);
  --sl-color-red: oklch(70.4% 0.191 22.216);
  --sl-color-red-high: oklch(44.4% 0.177 26.899);
  --sl-color-green-low: oklch(96.2% 0.044 156.743);
  --sl-color-green: oklch(79.2% 0.209 151.711);
  --sl-color-green-high: oklch(44.8% 0.119 151.328);
  --sl-color-asides-text-accent: var(--sl-color-blue-high);
  --sl-color-asides-border: var(--sl-color-blue);
  --nano-color-highlight: var(--sl-color-gray-6);
}

body {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 10pt;
  line-height: 1.7;
  color: var(--sl-color-gray-2);
  background: #fff;
}

/* ── Cover ── */

.cover {
  page-break-after: always;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  text-align: center;
}

.cover h1 {
  font-size: 24pt;
  color: var(--sl-color-white);
  letter-spacing: -0.01em;
  margin-bottom: 0.4em;
  font-weight: 600;
}

.cover .sub {
  font-size: 12pt;
  color: var(--sl-color-gray-3);
  font-weight: 500;
  margin-bottom: 1.2em;
}

.cover .author {
  font-size: 11pt;
  color: var(--sl-color-gray-4);
  margin-bottom: 0.3em;
}

.cover .date {
  font-size: 9pt;
  color: var(--sl-color-gray-4);
}

.cover .links {
  margin-top: 2.5em;
  display: flex;
  gap: 1.5em;
}

.cover .links a {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  font-size: 9pt;
  color: var(--sl-color-gray-3);
  text-decoration: none;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.5rem;
  padding: 0.3em 0.75em;
}

.cover .links a svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ── TOC ── */

.toc {
  page-break-after: always;
  padding-top: 0.5cm;
}

.toc h2 {
  font-size: 16pt;
  color: var(--sl-color-white);
  border-bottom: 2px solid var(--sl-color-gray-5);
  padding-bottom: 0.3em;
  margin-bottom: 0.8em;
  font-weight: 600;
}

.toc ul {
  list-style: none;
  padding-left: 0;
}

.toc li {
  padding: 0.25em 0;
  border-bottom: 1px dotted var(--sl-color-gray-5);
  font-size: 10pt;
}

.toc li a {
  color: var(--sl-color-gray-2);
  text-decoration: none;
}

.toc li a:hover {
  color: var(--sl-color-white);
}

.toc-group {
  margin-bottom: 0.8em;
}

.toc-group h3 {
  font-size: 11pt;
  color: var(--sl-color-gray-3);
  margin: 0.5em 0 0.2em;
  font-weight: 600;
}

/* ── Articles ── */

.article {
  page-break-before: always;
}

.a-title {
  font-size: 16pt;
  color: var(--sl-color-white);
  letter-spacing: -0.01em;
  border-bottom: 2px solid var(--sl-color-gray-5);
  padding-bottom: 0.25em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

/* ── Two-column content ── */

.a-content {
  column-count: 2;
  column-gap: 1.5cm;
  column-rule: 1px solid var(--sl-color-gray-6);
  column-fill: auto;
  font-size: 10pt;
  line-height: 1.7;
  orphans: 3;
  widows: 3;
}

/* ── Typography ── */

.a-content h2 {
  font-size: 13pt;
  color: var(--sl-color-white);
  margin: 0.8em 0 0.3em;
  page-break-after: avoid;
  font-weight: 600;
}

.a-content h3 {
  font-size: 11.5pt;
  color: var(--sl-color-white);
  margin: 0.6em 0 0.25em;
  page-break-after: avoid;
  font-weight: 600;
}

.a-content h4 {
  font-size: 10.5pt;
  color: var(--sl-color-white);
  margin: 0.5em 0 0.2em;
  page-break-after: avoid;
  font-weight: 600;
}

.a-content p {
  margin: 0.4em 0;
  text-align: justify;
}

.a-content a {
  color: var(--sl-color-white);
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.a-content ul,
.a-content ol {
  margin: 0.4em 0;
  padding-inline-start: 1.6em;
}

.a-content ul > li {
  list-style-type: disc;
  list-style-position: outside;
  padding-inline-start: 0.3em;
  margin: 0.15em 0;
}

.a-content ol > li {
  list-style-type: decimal;
  list-style-position: outside;
  padding-inline-start: 0.3em;
  margin: 0.15em 0;
}

.a-content li > ul,
.a-content li > ol {
  margin: 0.1em 0;
}

/* ── Code blocks ── */

.a-content :not(pre) > code {
  background: var(--sl-color-bg-inline-code);
  border: 1px solid var(--sl-color-border-inline-code);
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-size: 9pt;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.a-content pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: inherit;
  border-radius: 0;
  border: none;
}

/* ── Tables ── */

.a-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
  margin: 0.5em 0;
  break-inside: avoid;
}

.a-content th {
  background: var(--sl-color-gray-7);
  color: var(--sl-color-white);
  font-weight: 600;
  text-align: left;
  padding: 0.4em 0.6em;
  border-bottom: 2px solid var(--sl-color-gray-5);
}

.a-content td {
  padding: 0.35em 0.6em;
  border-bottom: 1px solid var(--sl-color-gray-6);
}

.a-content tr:last-child td {
  border-bottom: none;
}

/* ── Blockquotes ── */

.a-content blockquote {
  border-left: 3px solid var(--sl-color-gray-4);
  background: var(--sl-color-gray-7);
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 0.4em 0.8em;
  margin: 0.5em 0;
}

.a-content blockquote p {
  margin: 0.2em 0;
}

/* ── Starlight Asides ── */

.a-content .starlight-aside {
  border-radius: 0.5rem;
  padding: 0.6em 1em;
  margin: 0.5em 0;
  break-inside: avoid;
}

.a-content .starlight-aside--note {
  background: var(--sl-color-blue-low);
  border: 1px solid var(--sl-color-blue);
}

.a-content .starlight-aside--tip {
  background: var(--sl-color-purple-low);
  border: 1px solid var(--sl-color-purple);
}

.a-content .starlight-aside--caution {
  background: var(--sl-color-orange-low);
  border: 1px solid var(--sl-color-orange);
}

.a-content .starlight-aside--danger {
  background: var(--sl-color-red-low);
  border: 1px solid var(--sl-color-red);
}

.a-content .starlight-aside__title {
  font-weight: 600;
  font-size: 10.5pt;
  margin-bottom: 0.2em;
  display: flex;
  align-items: center;
  gap: 0.3em;
}

.a-content .starlight-aside--note .starlight-aside__title { color: var(--sl-color-blue-high); }
.a-content .starlight-aside--tip .starlight-aside__title { color: var(--sl-color-purple-high); }
.a-content .starlight-aside--caution .starlight-aside__title { color: var(--sl-color-orange-high); }
.a-content .starlight-aside--danger .starlight-aside__title { color: var(--sl-color-red-high); }

.a-content .starlight-aside__icon {
  width: 16px;
  height: 16px;
}

.a-content .starlight-aside--note .starlight-aside__icon { color: var(--sl-color-blue-high); }
.a-content .starlight-aside--tip .starlight-aside__icon { color: var(--sl-color-purple-high); }
.a-content .starlight-aside--caution .starlight-aside__icon { color: var(--sl-color-orange-high); }
.a-content .starlight-aside--danger .starlight-aside__icon { color: var(--sl-color-red-high); }

.a-content .starlight-aside__content {
  margin-top: 0.2em;
}

/* ── Details / Summary ── */

.a-content details {
  margin: 0.5em 0;
  border: 1px solid var(--sl-color-gray-5);
  border-radius: 0.5rem;
  background: var(--sl-color-gray-7);
  break-inside: avoid;
}

.a-content summary {
  padding: 0.3em 0.8em;
  font-weight: 600;
  color: var(--sl-color-white);
  list-style: none;
}

.a-content details > :not(summary) {
  margin: 0 0.8em 0.5em;
}

/* ── KaTeX ── */

.katex-display {
  overflow-x: auto;
  margin: 0.8em 0;
  text-align: center;
}

.katex {
  font-size: 1em;
}

/* ── Images ── */

.a-content img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 0.3em 0;
}

.a-content p > img:only-child {
  display: block;
  margin: 0.5em auto;
  max-width: 90%;
  height: auto;
}

.a-content p > img:only-child {
  display: block;
  margin: 0.5em auto;
  max-width: 90%;
  height: auto;
}

/* ── Horizontal rules ── */

.a-content hr {
  border: none;
  border-top: 1px solid var(--sl-color-gray-5);
  margin: 0.8em 0;
}

/* ── Strong / Emphasis ── */

.a-content strong {
  color: var(--sl-color-white);
  font-weight: 600;
}

.a-content em {
  font-style: italic;
}

/* ── Header anchors (hide permalink icons) ── */

.a-content .sl-anchor-link {
  display: none;
}

.a-content .sl-heading-wrapper {
  display: block;
}

/* ── Part label ── */

.part-label {
  font-size: 11pt;
  color: var(--sl-color-gray-3);
  font-weight: 600;
  margin-bottom: 0.3em;
}

/* ── Shiki code highlighting (light mode) ── */

.astro-code,
.astro-code span {
  color: var(--shiki-light) !important;
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}

.a-content .astro-code {
  padding: 0;
  font-size: 8.5pt;
  border-radius: 0.5rem;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid var(--sl-color-gray-5);
  column-span: all;
  margin: 0.5em 0;
  break-inside: avoid;
  line-height: 1.5;
}

.a-content .astro-code > code {
  display: grid;
  align-items: stretch;
  overflow-x: hidden;
  padding: 0.75rem 0;
  box-sizing: border-box;
  min-width: min-content;
  background: none;
  border: none;
}

.a-content .astro-code .line {
  min-height: 1lh;
  padding-left: 1rem;
  padding-right: 1rem;
  display: inline-block;
  flex: 1;
  flex-grow: 1;
  width: 100%;
  min-width: min-content;
}

.a-content .astro-code .line.highlighted {
  background-color: var(--nano-color-highlight);
}

.a-content .astro-code .line.diff.add {
  background-color: var(--sl-color-green-low);
}

.a-content .astro-code .line.diff.remove {
  background-color: var(--sl-color-red-low);
}
`;
