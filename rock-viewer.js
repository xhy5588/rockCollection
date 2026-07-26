import { mountRockViewer } from "./rock-model.js";

const host = document.getElementById("canvas-host");
const status = document.getElementById("status");
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "prehnite";
const modelUrl = window.siteUrl(`/models/${id}.usdz`);

const title = document.querySelector(".bar strong");
if (title) title.textContent = `3D Scan — ${id}`;

mountRockViewer(host, { statusEl: status, modelUrl }).catch((err) => {
  if (status) {
    status.textContent =
      "Could not load 3D model. Make sure node serve.js is running, then refresh.";
  }
  console.error(err);
});
