import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist-static", { recursive: true, force: true });
await mkdir("dist-static", { recursive: true });
await cp("static", "dist-static", { recursive: true });
await rm("dist-static/icons", { recursive: true, force: true });
await cp("public/site-data.json", "dist-static/site-data.json");

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
  await cp("static/index.html", `dist-static/${route}/index.html`);
}

console.log(`Static site written to dist-static (${routes.length + 1} routes)`);
