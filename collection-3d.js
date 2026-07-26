import { mountRockViewer } from "./rock-model.js";
import { needsStatic3d, mountStaticViewer } from "./static-3d.js";

const viewers = new Map();

function cardForId(id) {
  return document.querySelector(`.collection-card[data-id="${id}"]`);
}

function setActiveTab(card, view) {
  card.querySelectorAll(".collection-card__tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
  card.querySelector(".collection-card__photo-view").hidden = view !== "photo";
  card.querySelector(".collection-card__3d-view").hidden = view !== "3d";
}

function unloadCard(card) {
  const id = card.dataset.id;
  const entry = viewers.get(id);
  if (entry) {
    entry.dispose();
    viewers.delete(id);
  }
  card.classList.remove("is-3d-ready");
  const status = card.querySelector(".collection-card__3d-status");
  if (status) {
    status.textContent = status.dataset.loading || "Loading 3D model…";
    status.classList.remove("hidden");
  }
}

function unloadOthers(activeId) {
  for (const [id, entry] of viewers) {
    if (id !== activeId) {
      entry.dispose();
      viewers.delete(id);
      const other = cardForId(id);
      if (other) {
        other.classList.remove("is-3d-ready");
        setActiveTab(other, "photo");
      }
    }
  }
}

async function loadCard3d(card) {
  const id = card.dataset.id;
  const host = card.querySelector(".collection-card__3d-host");
  const model = host?.dataset.model;
  if (!model || viewers.has(id)) return;

  unloadOthers(id);

  const status = card.querySelector(".collection-card__3d-status");
  if (status) {
    status.textContent = status.dataset.loading || "Loading 3D model…";
    status.classList.remove("hidden");
  }

  try {
    let result;
    if (needsStatic3d()) {
      result = await mountStaticViewer(host, { modelUrl: model, statusEl: status });
    } else {
      result = await mountRockViewer(host, { statusEl: status, modelUrl: model });
    }
    viewers.set(id, result);
    card.classList.add("is-3d-ready");
  } catch (err) {
    if (status) {
      const onPages = location.hostname.endsWith("github.io");
      status.textContent = onPages
        ? status.dataset.pagesError || status.dataset.error || "Could not load 3D model"
        : status.dataset.error || "Could not load 3D model";
      status.classList.remove("hidden");
    }
    console.error(err);
  }
}

async function switchView(card, view) {
  if (view === "3d" && card.dataset.hasModel !== "true") return;
  setActiveTab(card, view);
  if (view === "3d") {
    await loadCard3d(card);
  } else {
    unloadCard(card);
  }
}

export function setupCollection3d(root = document.getElementById("collection-grid")) {
  if (!root) return;

  root.querySelectorAll(".collection-card").forEach((card) => {
    card.querySelectorAll(".collection-card__tab").forEach((tab) => {
      tab.addEventListener("click", () => switchView(card, tab.dataset.view));
    });
  });
}

export function disposeAllCollection3d() {
  for (const [, entry] of viewers) entry.dispose();
  viewers.clear();
}

export async function openCollection3d(id) {
  const card = cardForId(id);
  if (!card || card.dataset.hasModel !== "true") return false;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  await switchView(card, "3d");
  return true;
}

window.Collection3d = {
  setup: setupCollection3d,
  disposeAll: disposeAllCollection3d,
  open: openCollection3d,
};
