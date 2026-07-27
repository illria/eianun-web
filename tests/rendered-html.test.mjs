import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the EIANUN route map homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>EIANUN · 出海金融行动指南<\/title>/i);
  assert.match(html, /普通人的/);
  assert.match(html, /全球资金通关图/);
  assert.match(html, /新人常用工具/);
  assert.match(html, /8 关出海行动路线/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("keeps starter preview infrastructure out of the finished site", async () => {
  const [css, page, siteApp, layout, packageJson, siteData, staticScript] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-app.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../public/site-data.json", import.meta.url), "utf8"),
    readFile(new URL("../static/site.js", import.meta.url), "utf8"),
  ]);

  const data = JSON.parse(siteData);
  assert.match(page, /SiteApp/);
  assert.match(siteApp, /use client/);
  assert.match(siteApp, /eianun-theme/);
  assert.match(siteApp, /sessionStorage/);
  assert.match(siteApp, /nifulei-journey/);
  assert.match(css, /\.journey-layout/);
  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(staticScript, /roadmapPage/);
  assert.equal(Object.keys(data.categoryPages).length, 4);
  assert.ok(data.tools.length >= 35);
  assert.equal(data.journey.length, 8);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /EIANUN · 出海金融行动指南/);
  assert.doesNotMatch(page + siteApp + layout + css + packageJson, /SkeletonPreview|codex-preview|Starter Project/);
});
