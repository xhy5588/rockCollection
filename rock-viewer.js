import { mountRockViewer } from "./rock-model.js";
import { needsStatic3d, mountStaticViewer } from "./static-3d.js";

const host = document.getElementById("canvas-host");
const status = document.getElementById("status");
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "prehnite";
const modelUrl = `/models/${id}.usdz`;

const title = document.querySelector(".bar strong");
if (title) title.textContent = `3D Scan — ${id}`;

async function start() {
  try {
    if (needsStatic3d()) {
      await mountStaticViewer(host, { modelUrl, statusEl: status });
    } else {
      await mountRockViewer(host, {
        statusEl: status,
        modelUrl: window.siteUrl(modelUrl),
      });
    }
  } catch (err) {
    if (status) {
      status.textContent = needsStatic3d()
        ? "Could not load 3D preview. On iPhone, tap the model for AR if it appears."
        : "Could not load 3D model. Run node serve.js locally, then refresh.";
      status.classList.remove("hidden");
    }
    console.error(err);
  }
}

start();
