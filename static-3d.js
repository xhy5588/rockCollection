let modelViewerReady = null;

export function needsStatic3d() {
  if (location.hostname.endsWith("github.io")) return true;
  if (location.protocol === "file:") return true;
  return !window.crossOriginIsolated;
}

export function ensureModelViewer() {
  if (customElements.get("model-viewer")) {
    return Promise.resolve();
  }
  if (!modelViewerReady) {
    modelViewerReady = import(
      "https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"
    );
  }
  return modelViewerReady;
}

export async function mountStaticViewer(host, { modelUrl, statusEl }) {
  await ensureModelViewer();
  const src = window.siteUrl
    ? window.siteUrl(modelUrl.startsWith("/") ? modelUrl : `/${modelUrl}`)
    : modelUrl.startsWith("/")
      ? modelUrl
      : `/${modelUrl}`;

  host.innerHTML = "";
  const mv = document.createElement("model-viewer");
  mv.setAttribute("src", src);
  mv.setAttribute("camera-controls", "");
  mv.setAttribute("touch-action", "pan-y");
  mv.setAttribute("auto-rotate", "");
  mv.setAttribute("rotation-per-second", "20deg");
  mv.setAttribute("shadow-intensity", "1");
  mv.setAttribute("environment-image", "neutral");
  mv.setAttribute("alt", "3D rock scan");
  mv.style.width = "100%";
  mv.style.height = "100%";
  mv.style.background = "#c5cdd6";

  mv.addEventListener(
    "error",
    () => {
      if (statusEl) {
        statusEl.textContent =
          statusEl.dataset.pagesError ||
          "Could not load 3D model on this host.";
        statusEl.classList.remove("hidden");
      }
    },
    { once: true }
  );

  mv.addEventListener(
    "load",
    () => {
      if (statusEl) statusEl.classList.add("hidden");
    },
    { once: true }
  );

  host.appendChild(mv);

  return {
    dispose() {
      host.innerHTML = "";
    },
  };
}
