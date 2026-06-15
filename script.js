/* global L, MOUNTAINS */

const YUNNAN_CENTER = [27.0, 100.2];

function rockSwatch(rock) {
  return `
    <li class="rock">
      <span
        class="rock__stone"
        style="background: radial-gradient(circle at 32% 28%, ${rock.color1}, ${rock.color2});"
        aria-hidden="true"
      ></span>
      <div class="rock__text">
        <p class="rock__name">${rock.name}</p>
        <p class="rock__type">${rock.type}</p>
        <p class="rock__note">${rock.note}</p>
      </div>
    </li>`;
}

function renderPanel(m) {
  const panel = document.getElementById("detail-panel");
  panel.classList.remove("panel--empty");
  panel.style.setProperty("--accent", m.accent);
  panel.innerHTML = `
    <div class="panel__header">
      <span class="panel__badge">${m.elevation.toLocaleString()} m</span>
      <h3>${m.name}</h3>
      <p class="panel__sub">${m.chinese} · Peak: ${m.peak}</p>
      <p class="panel__region">📍 ${m.region}</p>
    </div>
    <p class="panel__story">${m.story}</p>
    <h4 class="panel__rocks-title">Rocks I collected here</h4>
    <ul class="rock-list">
      ${m.rocks.map(rockSwatch).join("")}
    </ul>`;
  panel.scrollTop = 0;
}

function buildQuicklist(onSelect) {
  const list = document.getElementById("peak-quicklist");
  list.innerHTML = MOUNTAINS.map(
    (m) =>
      `<li><button type="button" data-id="${m.id}">${m.name} · ${m.elevation.toLocaleString()}m</button></li>`
  ).join("");
  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = MOUNTAINS.find((x) => x.id === btn.dataset.id);
      onSelect(m);
    });
  });
}

function buildCollection() {
  const grid = document.getElementById("collection-grid");
  grid.innerHTML = MOUNTAINS.map(
    (m) => `
      <div class="collection-card" style="--accent:${m.accent}">
        <h3>${m.name}</h3>
        <p class="collection-card__sub">${m.chinese}</p>
        <ul class="rock-list">${m.rocks.map(rockSwatch).join("")}</ul>
      </div>`
  ).join("");
}

function makeMarkerIcon(m) {
  return L.divIcon({
    className: "peak-marker",
    html: `<span class="peak-marker__pin" style="--accent:${m.accent}">▲</span>
           <span class="peak-marker__label">${m.name}</span>`,
    iconSize: [120, 40],
    iconAnchor: [16, 34],
  });
}

function initMap() {
  const map = L.map("leaflet-map", {
    center: YUNNAN_CENTER,
    zoom: 7,
    scrollWheelZoom: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const markers = {};
  const select = (m) => {
    renderPanel(m);
    map.flyTo(m.coords, 9, { duration: 0.8 });
    Object.values(markers).forEach((mk) =>
      mk._icon && mk._icon.classList.remove("peak-marker--active")
    );
    if (markers[m.id]._icon) {
      markers[m.id]._icon.classList.add("peak-marker--active");
    }
  };

  MOUNTAINS.forEach((m) => {
    const marker = L.marker(m.coords, { icon: makeMarkerIcon(m), title: m.name })
      .addTo(map)
      .on("click", () => select(m));
    markers[m.id] = marker;
  });

  buildQuicklist(select);
  return map;
}

document.addEventListener("DOMContentLoaded", () => {
  buildCollection();
  initMap();
});
