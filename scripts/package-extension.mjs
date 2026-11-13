import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const target = process.argv[2] === "firefox" ? "firefox" : "chrome";
const destination = resolve(root, "dist", `extension-${target}`);
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(resolve(root, "extension"), destination, { recursive: true });
const manifest = await readFile(resolve(destination, `manifest.${target}.json`), "utf8");
await writeFile(resolve(destination, "manifest.json"), manifest);
await rm(resolve(destination, "manifest.chrome.json"), { force: true });
await rm(resolve(destination, "manifest.firefox.json"), { force: true });
console.log(`Packaged ${target} extension at ${destination}`);
