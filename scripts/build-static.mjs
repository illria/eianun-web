import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist-static", { recursive: true, force: true });
await mkdir("dist-static", { recursive: true });
await cp("static", "dist-static", { recursive: true });
await rm("dist-static/icons", { recursive: true, force: true });
await cp("public/site-data.json", "dist-static/site-data.json");

const stylesheet = await readFile("static/site.css", "utf8");
const inlineStyles = (html) => html.replace(
  '  <link rel="stylesheet" href="./site.css">\n',
  `  <style>\n${stylesheet}\n  </style>\n`
);

const rootHtml = await readFile("dist-static/index.html", "utf8");
await writeFile("dist-static/index.html", inlineStyles(rootHtml));

const routes = [
  "nifulei-bank",
  "nifulei-broker",
  "nifulei-crypto",
  "nifulei-esim",
  "nifulei-roadmap",
  "nifulei-journey",
  "nifulei-about",
  "nifulei-partner",
];

for (const route of routes) {
  await mkdir(`dist-static/${route}`, { recursive: true });
  await writeFile(`dist-static/${route}/index.html`, inlineStyles(await readFile("static/index.html", "utf8")));
}

console.log(`Static site written to dist-static (${routes.length + 1} routes)`);
