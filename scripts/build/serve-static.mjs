#!/usr/bin/env node
/**
 * Minimal static server for the exported site (`out/`).
 *
 * `output: "export"` removes `next start`, so both `pnpm start` and the
 * Playwright `webServer` serve the exported document the same way the
 * Cloudflare Worker assets binding does. Responses are compressed with the same
 * encodings the edge uses, so local measurements see production-sized payloads
 * instead of raw bytes.
 *
 * Usage: node scripts/build/serve-static.mjs [--dir=out] [--port=3100] [--host=127.0.0.1]
 */

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const argv = process.argv.slice(2);
const args = {};

for (let index = 0; index < argv.length; index += 1) {
  const [key, ...rest] = argv[index].replace(/^--/, "").split("=");
  if (rest.length) {
    args[key] = rest.join("=");
  } else if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
    args[key] = argv[index + 1];
    index += 1;
  } else {
    args[key] = "true";
  }
}

const root = path.resolve(args.dir ?? "out");
const port = Number(args.port ?? process.env.PORT ?? 3100);
const host = args.host ?? "127.0.0.1";

if (!existsSync(root)) {
  console.error(`static export not found at ${root}. Run \`pnpm run build\` first.`);
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const COMPRESSIBLE = new Set([".html", ".js", ".mjs", ".css", ".json", ".txt", ".xml", ".svg"]);

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(root, clean),
    path.join(root, `${clean}.html`),
    path.join(root, clean, "index.html"),
  ];

  for (const candidate of candidates) {
    if (candidate.startsWith(root) && existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

const compressed = new Map();

function compress(file, encoding) {
  // Key on the file's identity, not just its path: a rebuild rewrites `out/` in
  // place, and a path-only key would keep serving the previous build's HTML,
  // which points at purged asset hashes.
  const { mtimeMs, size } = statSync(file);
  const key = `${file}:${size}:${mtimeMs}:${encoding}`;
  const cached = compressed.get(key);

  if (cached) {
    return cached;
  }

  const body = readFileSync(file);
  const output = encoding === "br" ? brotliCompressSync(body) : gzipSync(body, { level: 9 });

  compressed.set(key, output);

  return output;
}

createServer((request, response) => {
  const file = resolveFile(request.url ?? "/");

  if (!file) {
    const notFound = path.join(root, "404.html");

    if (existsSync(notFound)) {
      const body = readFileSync(notFound);
      response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      response.end(body);
      return;
    }

    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end("<h1>404</h1>");
    return;
  }

  const extension = path.extname(file);
  const contentType = MIME[extension] ?? "application/octet-stream";
  const accepts = request.headers["accept-encoding"] ?? "";

  if (COMPRESSIBLE.has(extension)) {
    const encoding = accepts.includes("br") ? "br" : accepts.includes("gzip") ? "gzip" : null;

    if (encoding) {
      const body = compress(file, encoding);
      response.writeHead(200, {
        "content-type": contentType,
        "content-encoding": encoding,
        "content-length": body.length,
        "cache-control": "public, max-age=0, must-revalidate",
      });
      response.end(body);
      return;
    }
  }

  response.writeHead(200, {
    "content-type": contentType,
    "content-length": statSync(file).size,
    "cache-control": "public, max-age=0, must-revalidate",
  });
  createReadStream(file).pipe(response);
}).listen(port, host, () => {
  console.log(`static export on http://${host}:${port} (dir ${root})`);
});
