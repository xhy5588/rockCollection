/* global L, SPECIMENS, UI_STRINGS, MAP_CENTER */

const PAGE = document.body.dataset.page || "earth";

let currentLang = localStorage.getItem("lang") || "zh";
let activeSpecimenId = null;
let mapInstance = null;
let markers = {};

const earthSpecimens = SPECIMENS.filter((s) => s.origin !== "meteorite");
const meteoriteSpecimens = SPECIMENS.filter((s) => s.origin === "meteorite");

function t(key) {
  return UI_STRINGS[currentLang][key] || key;
}

function field(obj) {
  return obj[currentLang] || obj.en;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  applyStaticText();

  if (PAGE === "earth") {
    rebuildEarthCollection();
    buildQuicklist(selectSpecimen);
    if (activeSpecimenId) {
      const s = earthSpecimens.find((x) => x.id === activeSpecimenId);
      if (s) renderPanel(s, "detail-panel", (id) => {
        activeSpecimenId = id;
      });
    }
  }

  if (PAGE === "meteorites") {
    rebuildMeteoriteCollection();
  }

  if (PAGE === "meteorite-detail") {
    renderMeteoriteDetail();
  }

  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) langToggle.textContent = t("langLabel");
}

function applyStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.dataset.i18nHtml === "true") el.innerHTML = val;
    else el.textContent = val;
  });

  const statEarth = document.getElementById("stat-earth");
  if (statEarth) statEarth.textContent = earthSpecimens.length;

  const statMeteorites = document.getElementById("stat-meteorites");
  if (statMeteorites) statMeteorites.textContent = meteoriteSpecimens.length;

  const statProvinces = document.getElementById("stat-provinces");
  if (statProvinces) {
    statProvinces.textContent = new Set(earthSpecimens.map((s) => s.province)).size;
  }
}

function specimenPhotoAlt(s) {
  return `${field(s.name)} — ${field(s.locality)}`;
}

function renderPhotoGallery(s) {
  if (!s.photos || s.photos.length <= 1) return "";
  const alt = specimenPhotoAlt(s);
  const items = s.photos
    .slice(1)
    .map(
      (src, i) =>
        `<figure class="panel__photo"><img src="${src}" alt="${alt} (${i + 2})" loading="lazy" /></figure>`
    )
    .join("");
  return `
    <h4 class="panel__rocks-title">${t("panelPhotos")}</h4>
    <div class="panel__photos">${items}</div>`;
}

function renderCover(s, className) {
  if (s.cover) {
    return `<img class="${className}" src="${s.cover}" alt="${specimenPhotoAlt(s)}" loading="lazy" />`;
  }
  return `<div class="${className} ${className}--empty"><span>${t("noFieldPhoto")}</span></div>`;
}

function renderCollectionMedia(s) {
  const hasModel = Boolean(s.model3d);
  const missingText = t("collection3dMissing").replace("{id}", s.id);
  return `
    <div class="collection-card__media">
      <div class="collection-card__tabs" role="tablist">
        <button type="button" class="collection-card__tab is-active" data-view="photo" role="tab" aria-selected="true">${t("collectionTabPhoto")}</button>
        <button type="button" class="collection-card__tab${hasModel ? "" : " is-disabled"}" data-view="3d" role="tab" aria-selected="false"${hasModel ? "" : " disabled"}>${t("collectionTab3d")}</button>
      </div>
      <div class="collection-card__photo-view">
        ${renderCover(s, "collection-card__photo")}
      </div>
      <div class="collection-card__3d-view" hidden>
        <div class="collection-card__3d-frame">
          <div class="collection-card__3d-host" data-model="${s.model3d || ""}"></div>
          <p class="collection-card__3d-status" data-loading="${t("collection3dLoading")}" data-error="${t("collection3dError")}" data-mobile-error="${t("collection3dMobileHint")}">${t("collection3dLoading")}</p>
          <p class="collection-card__3d-hint">${currentLang === "zh" ? "滑动旋转 · 双指缩放" : "Drag to rotate · Pinch to zoom"}</p>
        </div>
        ${hasModel ? "" : `<p class="collection-card__3d-missing">${missingText}</p>`}
      </div>
    </div>`;
}

function renderPanel3dAction(s, gridId) {
  if (!s.model3d) return "";
  return `<button type="button" class="panel__3d-btn" data-id="${s.id}" data-grid="${gridId}">${t("collectionView3d")}</button>`;
}

function renderPanel(s, panelId, setActive) {
  setActive(s.id);
  const panel = document.getElementById(panelId);
  const isMeteorite = s.origin === "meteorite";
  panel.classList.remove("panel--empty");
  panel.style.setProperty("--accent", s.accent);
  panel.innerHTML = `
    <div class="panel__header">
      ${renderCover(s, "panel__cover")}
      <span class="panel__badge">${field(s.locality)}</span>
      <h3>${field(s.name)}</h3>
      <p class="panel__sub">${field(s.mineralClass)}</p>
      <p class="panel__region">${field(s.locality)}</p>
    </div>
    <p class="panel__story">${field(s.summary)}</p>
    ${renderPanel3dAction(s, panelId === "meteorite-panel" ? "meteorite-grid" : "collection-grid")}
    ${renderPhotoGallery(s)}
    <h4 class="panel__rocks-title">${t("panelAppearance")}</h4>
    <p class="panel__detail">${field(s.appearance)}</p>
    <h4 class="panel__rocks-title">${t(isMeteorite ? "panelCosmicOrigin" : "panelFormation")}</h4>
    <p class="panel__detail">${field(s.formation)}</p>
    <h4 class="panel__rocks-title">${t(isMeteorite ? "panelDiscovery" : "panelGeology")}</h4>
    <p class="panel__detail">${field(s.geology)}</p>`;
  panel.querySelector(".panel__3d-btn")?.addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.id;
    const gridId = e.currentTarget.dataset.grid;
    document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
    window.Collection3d?.open(id);
  });
  panel.scrollTop = 0;
}

function renderMeteoritePreview(s) {
  return `
    <div class="collection-card__media collection-card__media--preview">
      ${renderCover(s, "collection-card__photo")}
    </div>`;
}

function renderMeteoriteDetail() {
  const root = document.getElementById("meteorite-detail");
  if (!root) return;

  if (window.Collection3d) window.Collection3d.disposeAll();

  const id = new URLSearchParams(window.location.search).get("id");
  const s = meteoriteSpecimens.find((item) => item.id === id);
  const name = document.getElementById("meteorite-detail-name");
  const mineralClass = document.getElementById("meteorite-detail-class");

  if (!s) {
    if (name) name.textContent = t("meteoriteNotFound");
    if (mineralClass) mineralClass.textContent = t("meteoriteNotFoundText");
    root.innerHTML = `
      <div class="meteorite-detail__empty">
        <p>${t("meteoriteNotFoundText")}</p>
        <a href="meteorites.html">${t("meteoriteBack")}</a>
      </div>`;
    document.title = `${t("meteoriteNotFound")} — Peaks & Pebbles`;
    return;
  }

  if (name) name.textContent = field(s.name);
  if (mineralClass) mineralClass.textContent = `${field(s.mineralClass)} · ${field(s.locality)}`;
  document.title = `${field(s.name)} — Peaks & Pebbles`;
  root.style.setProperty("--accent", s.accent);
  root.innerHTML = `
    <div class="meteorite-detail__layout">
      <div id="meteorite-detail-media" class="meteorite-detail__media">
        <div class="collection-card meteorite-detail__media-card" data-id="${s.id}" data-has-model="${s.model3d ? "true" : "false"}" style="--accent:${s.accent}">
          ${renderCollectionMedia(s)}
        </div>
      </div>
      <article class="meteorite-record">
        <header class="meteorite-record__header">
          <span class="meteorite-record__badge">${field(s.locality)}</span>
          <p class="meteorite-record__class">${field(s.mineralClass)}</p>
          <p class="meteorite-record__summary">${field(s.summary)}</p>
        </header>
        <div class="meteorite-record__notes">
          <section class="meteorite-record__note">
            <p class="meteorite-record__number">01</p>
            <h2>${t("panelAppearance")}</h2>
            <p>${field(s.appearance)}</p>
          </section>
          <section class="meteorite-record__note">
            <p class="meteorite-record__number">02</p>
            <h2>${t("panelCosmicOrigin")}</h2>
            <p>${field(s.formation)}</p>
          </section>
          <section class="meteorite-record__note">
            <p class="meteorite-record__number">03</p>
            <h2>${t("panelDiscovery")}</h2>
            <p>${field(s.geology)}</p>
          </section>
        </div>
      </article>
    </div>`;

  window.Collection3d?.setup(document.getElementById("meteorite-detail-media"));
}

function buildQuicklist(onSelect) {
  const list = document.getElementById("peak-quicklist");
  if (!list) return;
  list.innerHTML = earthSpecimens.map(
    (s) =>
      `<li><button type="button" data-id="${s.id}">${field(s.name)} · ${field(s.locality)}</button></li>`
  ).join("");
  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      onSelect(earthSpecimens.find((x) => x.id === btn.dataset.id));
    });
  });
}

function rebuildEarthCollection() {
  if (window.Collection3d) window.Collection3d.disposeAll();
  buildCollection("collection-grid", earthSpecimens, { mapTarget: true });
}

function rebuildMeteoriteCollection() {
  if (window.Collection3d) window.Collection3d.disposeAll();
  buildCollection("meteorite-grid", meteoriteSpecimens, { meteoriteTarget: true });
}

function buildCollection(gridId, specimens, options = {}) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (gridId === "meteorite-grid") {
    const section = document.querySelector(".meteorite-section");
    if (specimens.length === 0) {
      section?.classList.add("is-empty");
      grid.innerHTML = "";
      return;
    }
    section?.classList.remove("is-empty");
  }

  const viewLabel = options.meteoriteTarget
    ? t("meteoriteViewDetails")
    : currentLang === "zh"
      ? "查看详情"
      : "View on map";

  grid.innerHTML = specimens.map((s) => {
    const action = options.meteoriteTarget
      ? `<a class="collection-card__btn" href="meteorite.html?id=${encodeURIComponent(s.id)}">${viewLabel}</a>`
      : `<button type="button" class="collection-card__btn" data-id="${s.id}">${viewLabel}</button>`;
    return `
      <div class="collection-card" data-id="${s.id}" data-has-model="${s.model3d ? "true" : "false"}" style="--accent:${s.accent}">
        ${options.meteoriteTarget ? renderMeteoritePreview(s) : renderCollectionMedia(s)}
        <h3>${field(s.name)}</h3>
        <p class="collection-card__sub">${field(s.mineralClass)} · ${field(s.locality)}</p>
        <p class="collection-card__summary">${field(s.summary)}</p>
        ${action}
      </div>`;
  }).join("");

  grid.querySelectorAll("button.collection-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = specimens.find((x) => x.id === btn.dataset.id);
      if (options.mapTarget) {
        selectSpecimen(s);
        document.getElementById("map").scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  if (!options.meteoriteTarget) window.Collection3d?.setup(grid);
}

function makeMarkerIcon(s) {
  return L.divIcon({
    className: "peak-marker",
    html: `<span class="peak-marker__pin" style="--accent:${s.accent}">◆</span>
           <span class="peak-marker__label">${field(s.name)}</span>`,
    iconSize: [140, 40],
    iconAnchor: [16, 34],
  });
}

function selectSpecimen(s) {
  renderPanel(s, "detail-panel", (id) => {
    activeSpecimenId = id;
  });
  mapInstance.flyTo(s.coords, 9, { duration: 0.8 });
  Object.values(markers).forEach((mk) =>
    mk._icon && mk._icon.classList.remove("peak-marker--active")
  );
  if (markers[s.id]._icon) {
    markers[s.id]._icon.classList.add("peak-marker--active");
  }
}

function initMap() {
  mapInstance = L.map("leaflet-map", {
    center: MAP_CENTER,
    zoom: 6,
    scrollWheelZoom: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapInstance);

  earthSpecimens.forEach((s) => {
    const marker = L.marker(s.coords, {
      icon: makeMarkerIcon(s),
      title: field(s.name),
    })
      .addTo(mapInstance)
      .on("click", () => selectSpecimen(s));
    markers[s.id] = marker;
  });

  buildQuicklist(selectSpecimen);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    setLang(currentLang === "zh" ? "en" : "zh");
  });
  setLang(currentLang);

  if (PAGE === "earth") initMap();
});
