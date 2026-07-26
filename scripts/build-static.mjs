import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist-static", { recursive: true, force: true });
await mkdir("dist-static", { recursive: true });
await cp("static", "dist-static", { recursive: true });
console.log("Static site written to dist-static");
