const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || process.argv[2]) || 8080;
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

/** 3D viewer assets — credentialless matches Cloudflare Pages and mobile Safari */
function needsCredentiallessIsolation(urlPath) {
  const p = normalizePath(urlPath);
  return (
    p === "/" ||
    p === "/index.html" ||
    p === "/earth.html" ||
    p === "/meteorites.html" ||
    p === "/meteorite.html" ||
    p === "/specimen-inline.js" ||
    p === "/collection-3d.js" ||
    p === "/viewer.html" ||
    p === "/viewer-embed.html" ||
    p === "/scan.html" ||
    p === "/rock-model.js" ||
    p === "/rock-viewer.js" ||
    p.startsWith("/wasm/") ||
    (p.startsWith("/models/") && p.endsWith(".usdz"))
  );
}

function applyIsolationHeaders(urlPath, headers) {
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
