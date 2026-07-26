const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".usdz": "model/vnd.usdz+zip",
  ".glb": "model/gltf-binary",
  ".wasm": "application/wasm",
  ".data": "application/octet-stream",
  ".objcap": "application/zip",
};

function resolveFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel =
    decoded === "/" || decoded === ""
      ? "index.html"
      : decoded.replace(/^\/+/, "");

  const safeParts = path
    .posix
    .normalize("/" + rel)
    .split("/")
    .filter((part) => part && part !== "..");

  return path.join(ROOT, ...safeParts);
}

function normalizePath(urlPath) {
  return decodeURIComponent(urlPath.split("?")[0]).toLowerCase();
}

/** Full viewer + WASM assets — strict isolation */
function needsStrictIsolation(urlPath) {
  const p = normalizePath(urlPath);
  return (
    p === "/viewer.html" ||
    p === "/viewer-embed.html" ||
    p.startsWith("/wasm/") ||
    p === "/rock-model.js" ||
    p === "/rock-viewer.js" ||
    (p.startsWith("/models/") && p.endsWith(".usdz"))
  );
}

/** Homepage inline 3D — credentialless keeps OSM tiles + Leaflet CDN working */
function needsCredentiallessIsolation(urlPath) {
  const p = normalizePath(urlPath);
  return p === "/" || p === "/index.html" || p === "/specimen-inline.js" || p === "/collection-3d.js";
}

function applyIsolationHeaders(urlPath, headers) {
  if (needsStrictIsolation(urlPath)) {
    headers["Cross-Origin-Embedder-Policy"] = "require-corp";
    headers["Cross-Origin-Opener-Policy"] = "same-origin";
    headers["Cross-Origin-Resource-Policy"] = "same-origin";
    return;
  }
  if (needsCredentiallessIsolation(urlPath)) {
    headers["Cross-Origin-Embedder-Policy"] = "credentialless";
    headers["Cross-Origin-Opener-Policy"] = "same-origin";
    headers["Cross-Origin-Resource-Policy"] = "same-origin";
  }
}

const server = http.createServer((req, res) => {
  const filePath = resolveFilePath(req.url);
  const normalizedRoot = path.resolve(ROOT);
  const normalizedFile = path.resolve(filePath);

  if (
    normalizedFile !== normalizedRoot &&
    !normalizedFile.startsWith(normalizedRoot + path.sep)
  ) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
    };

    applyIsolationHeaders(req.url, headers);

    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Peaks & Pebbles running at http://localhost:${PORT}`);
  console.log(`3D viewer: http://localhost:${PORT}/viewer.html`);
});
