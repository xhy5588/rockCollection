const viewers = new Map();
let mountRockViewer = null;

function cardForId(id) {
  return document.querySelector(`.collection-card[data-id="${id}"]`);
}

function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  return /MicroMessenger|WeChat|QQ\//i.test(ua);
}

function mobile3dBlockedReason(statusEl) {
  if (isInAppBrowser()) {
    return statusEl?.dataset.mobileError || "Open in Safari or Chrome for 3D.";
  }
  return null;
}

async function waitForVisible3dHost(host) {
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
  if (host.clientWidth > 0 && host.clientHeight > 0) return;
  await new Promise((resolve) => {
    const ro = new ResizeObserver(() => {
      if (host.clientWidth > 0 && host.clientHeight > 0) {
        ro.disconnect();
        resolve();
      }
    });
    ro.observe(host);
    setTimeout(() => {
      ro.disconnect();
      resolve();
    }, 4000);
  });
}

async function getMountRockViewer() {
  if (!mountRockViewer) {
    ({ mountRockViewer } = await import("./rock-model.js"));
  }
  return mountRockViewer;
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

  const blocked = mobile3dBlockedReason(status);
  if (blocked) {
    if (status) {
      status.textContent = blocked;
      status.classList.remove("hidden");
    }
    return;
  }

  try {
    await waitForVisible3dHost(host);
    if (status) {
      status.textContent =
        /iPhone|iPad|Android/i.test(navigator.userAgent)
          ? "Downloading 3D engine (~10 MB)…"
          : status.dataset.loading || "Loading 3D model…";
    }
    const mount = await getMountRockViewer();
    const { dispose } = await mount(host, {
      statusEl: status,
      modelUrl: model,
    });
    viewers.set(id, { dispose });
    card.classList.add("is-3d-ready");
  } catch (err) {
    if (status) {
      status.textContent = err?.message || status.dataset.error || "Could not load 3D model";
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
