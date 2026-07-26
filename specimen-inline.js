import { mountRockViewer } from "./rock-model.js";

const wrap = document.querySelector(".specimen-viewer-wrap");
const host = document.getElementById("specimen-canvas-host");
const status = document.getElementById("specimen-status");

if (host && wrap) {
  mountRockViewer(host, { statusEl: status })
    .then(() => {
      wrap.classList.add("is-ready");
    })
    .catch((err) => {
      if (status) {
        status.textContent =
          "Could not load here — use the full-screen viewer link →";
      }
      console.error(err);
    });
}
