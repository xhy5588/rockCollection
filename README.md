# rockCollection — Peaks & Pebbles

A personal journal about mountain-climbing adventures and rock collecting across
**five mountains in Yunnan, China**. The centerpiece is an interactive map: click
any peak to read the story of that climb and browse the rocks collected on the trip.

## Featured peaks

1. **Meili Snow Mountain** (梅里雪山) — Kawagebo, 6,740 m
2. **Jade Dragon Snow Mountain** (玉龙雪山) — 5,596 m, Lijiang
3. **Haba Snow Mountain** (哈巴雪山) — 5,396 m
4. **Cangshan Mountains** (苍山) — 4,122 m, Dali
5. **Jiaozi Snow Mountain** (轿子雪山) — 4,344 m, near Kunming

## Tech

Plain static site — HTML, CSS, and vanilla JavaScript. The interactive map uses
[Leaflet](https://leafletjs.com/) with OpenStreetMap tiles (loaded from CDN, so an
internet connection is needed for the map tiles to render).

| File | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Styling / layout |
| `data.js` | Mountain stories + rock collection data |
| `script.js` | Map, detail panel, and collection rendering |

## Run locally (development)

No build step is required. Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
