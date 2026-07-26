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
  assert.match(html, /<title>泥伏雷闯关记 · 出海金融第一站<\/title>/i);
  assert.match(html, /普通人的/);
  assert.match(html, /海外资金/);
  assert.match(html, /新人必备工具/);
  assert.match(html, /免责声明/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton|codex-preview/i);
});

test("keeps starter preview infrastructure out of the finished site", async () => {
  const [css, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /use client/);
  assert.match(page, /eianun-theme/);
  assert.match(page, /sessionStorage/);
  assert.match(css, /\.site-shell/);
  assert.match(css, /@media \(max-width: 500px\)/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /泥伏雷闯关记/);
  assert.doesNotMatch(page + layout + css + packageJson, /SkeletonPreview|codex-preview|Starter Project/);
});
