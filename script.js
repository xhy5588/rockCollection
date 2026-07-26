/* global L, SPECIMENS, UI_STRINGS, MAP_CENTER */

let currentLang = localStorage.getItem("lang") || "zh";
let activeSpecimenId = null;
let mapInstance = null;
let markers = {};

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
  buildCollection();
  buildQuicklist(selectSpecimen);
  if (activeSpecimenId) {
    const s = SPECIMENS.find((x) => x.id === activeSpecimenId);
    if (s) renderPanel(s);
  }
  document.getElementById("lang-toggle").textContent = t("langLabel");
}

function applyStaticText() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.dataset.i18nHtml === "true") el.innerHTML = val;
    else el.textContent = val;
  });
  document.getElementById("stat-specimens").textContent = SPECIMENS.length;
  document.getElementById("stat-provinces").textContent = new Set(
    SPECIMENS.map((s) => s.province)
  ).size;
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

function renderPanel3dAction(s) {
  if (!s.model3d) return "";
  return `<button type="button" class="panel__3d-btn" data-id="${s.id}">${t("collectionView3d")}</button>`;
}

function renderPanel(s) {
  activeSpecimenId = s.id;
  const panel = document.getElementById("detail-panel");
  panel.classList.remove("panel--empty");
  panel.style.setProperty("--accent", s.accent);
  panel.innerHTML = `
    <div class="panel__header">
      ${renderCover(s, "panel__cover")}
      <span class="panel__badge">${field(s.locality)}</span>
      <h3>${field(s.name)}</h3>
      <p class="panel__sub">${field(s.mineralClass)}</p>
      <p class="panel__region">📍 ${field(s.locality)}</p>
    </div>
    <p class="panel__story">${field(s.summary)}</p>
    ${renderPanel3dAction(s)}
    ${renderPhotoGallery(s)}
    <h4 class="panel__rocks-title">${t("panelAppearance")}</h4>
    <p class="panel__detail">${field(s.appearance)}</p>
    <h4 class="panel__rocks-title">${t("panelFormation")}</h4>
    <p class="panel__detail">${field(s.formation)}</p>
    <h4 class="panel__rocks-title">${t("panelGeology")}</h4>
    <p class="panel__detail">${field(s.geology)}</p>`;
  panel.querySelector(".panel__3d-btn")?.addEventListener("click", (e) => {
    const id = e.currentTarget.dataset.id;
    document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
    window.Collection3d?.open(id);
  });
  panel.scrollTop = 0;
}

function buildQuicklist(onSelect) {
  const list = document.getElementById("peak-quicklist");
  list.innerHTML = SPECIMENS.map(
    (s) =>
      `<li><button type="button" data-id="${s.id}">${field(s.name)} · ${field(s.locality)}</button></li>`
  ).join("");
  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      onSelect(SPECIMENS.find((x) => x.id === btn.dataset.id));
    });
  });
}

function buildCollection() {
  if (window.Collection3d) window.Collection3d.disposeAll();
  const grid = document.getElementById("collection-grid");
  grid.innerHTML = SPECIMENS.map(
    (s) => `
      <div class="collection-card" data-id="${s.id}" data-has-model="${s.model3d ? "true" : "false"}" style="--accent:${s.accent}">
        ${renderCollectionMedia(s)}
        <h3>${field(s.name)}</h3>
        <p class="collection-card__sub">${field(s.mineralClass)} · ${field(s.locality)}</p>
        <p class="collection-card__summary">${field(s.summary)}</p>
        <button type="button" class="collection-card__btn" data-id="${s.id}">${currentLang === "zh" ? "查看详情" : "View on map"}</button>
      </div>`
  ).join("");
  grid.querySelectorAll(".collection-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = SPECIMENS.find((x) => x.id === btn.dataset.id);
      selectSpecimen(s);
      document.getElementById("map").scrollIntoView({ behavior: "smooth" });
    });
  });
  window.Collection3d?.setup(grid);
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
  renderPanel(s);
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

  SPECIMENS.forEach((s) => {
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
  document.getElementById("lang-toggle").addEventListener("click", () => {
    setLang(currentLang === "zh" ? "en" : "zh");
  });
  setLang(currentLang);
  initMap();
});
