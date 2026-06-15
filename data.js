// Data for the Yunnan mountain climbing adventures & rock collection.
// Coordinates are real-world locations of each peak in Yunnan, China.

const MOUNTAINS = [
  {
    id: "meili",
    name: "Meili Snow Mountain",
    chinese: "梅里雪山",
    peak: "Kawagebo",
    elevation: 6740,
    region: "Dêqên (Diqing), NW Yunnan",
    coords: [28.4333, 98.6667],
    accent: "#6c8cff",
    summary:
      "A sacred, never-summited massif on the Tibetan border — my most humbling trek.",
    story:
      "Meili was the trip that changed how I think about mountains. Kawagebo is sacred to Tibetan Buddhists and has never been officially summited; climbing it is actually forbidden. So this was a pilgrimage trek, not a summit push. I started before dawn at Feilai Temple, hoping to catch the 'Sunrise on the Golden Mountain' — the moment the first light turns all thirteen peaks a burning gold. Clouds teased us for two mornings. On the third, the sky cracked open for ninety seconds and the whole ridge lit up. I just stood there. Later I hiked down toward the Mingyong Glacier, where meltwater carves the valley and the air smells of juniper smoke from prayer offerings. I gathered rocks only from the lower moraine, far from the holy ground.",
    rocks: [
      {
        name: "Glacial Schist",
        type: "Metamorphic",
        color1: "#7b8794",
        color2: "#3e4c59",
        note: "Smoothed flat by the Mingyong Glacier; flecked with silvery mica that catches sunrise light.",
      },
      {
        name: "Juniper-stained Quartz",
        type: "Mineral",
        color1: "#e6d8b5",
        color2: "#b89b5e",
        note: "Milky quartz pebble from the moraine, tinted ochre by mineral-rich meltwater.",
      },
      {
        name: "Tibetan Slate",
        type: "Sedimentary",
        color1: "#5a6472",
        color2: "#2b3138",
        note: "Thin, layered slate — the kind locals stack into mani prayer walls.",
      },
    ],
  },
  {
    id: "yulong",
    name: "Jade Dragon Snow Mountain",
    chinese: "玉龙雪山",
    peak: "Shanzidou",
    elevation: 5596,
    region: "Lijiang, NW Yunnan",
    coords: [27.1, 100.17],
    accent: "#34d399",
    summary:
      "Thirteen jagged peaks above Lijiang's old town — my first real high-altitude day.",
    story:
      "Jade Dragon rises like a frozen dragon's spine straight out of the subtropical valley around Lijiang. I rode the cable car to around 4,500m and then walked the boardwalk higher, where every breath felt like sipping through a straw. The altitude hit hard — I learned to chew on glucose candy and move at a quarter of my normal pace. Below the glacier sits Blue Moon Valley, a chain of impossibly turquoise pools fed by snowmelt and tinted by dissolved limestone. I spent the afternoon there, drying out by the water, sorting the limestone cobbles I'd picked up on the climb. The contrast still amazes me: glaciers above, jade-green water below, and Naxi music drifting up from the old town at night.",
    rocks: [
      {
        name: "Turquoise Travertine",
        type: "Sedimentary",
        color1: "#5eead4",
        color2: "#0d9488",
        note: "Limestone deposit from Blue Moon Valley, stained by the same minerals that turn the pools jade.",
      },
      {
        name: "Banded Limestone",
        type: "Sedimentary",
        color1: "#d6d3cd",
        color2: "#9c9890",
        note: "Pale gray cobble with fine bands — fizzes when I test it with a drop of vinegar.",
      },
      {
        name: "Glacier-polished Marble",
        type: "Metamorphic",
        color1: "#f3f4f6",
        color2: "#c7ccd1",
        note: "A bright white chip with faint gray veining, rounded smooth near the glacier's foot.",
      },
    ],
  },
  {
    id: "haba",
    name: "Haba Snow Mountain",
    chinese: "哈巴雪山",
    peak: "Haba",
    elevation: 5396,
    region: "Shangri-La / Tiger Leaping Gorge",
    coords: [27.35, 100.1],
    accent: "#f59e0b",
    summary:
      "My first true summit — a non-technical 5,000m+ peak across from Tiger Leaping Gorge.",
    story:
      "Haba is the classic 'first snow mountain' for climbers in China, and it earned that reputation honestly. From base camp at 4,100m we left at 1 a.m. by headlamp, crampons biting into the frozen scree. The summit push is a long, lung-crushing slog up a snow slope, but it's non-technical — pure willpower and rhythm. I reached the 5,396m summit just as the sun rose over Yulong across the canyon, with Tiger Leaping Gorge a thin dark line far below. My hands were too cold to feel the camera. On the descent I pocketed a few wind-scoured rocks from the summit ridge as proof to myself that I'd really stood there.",
    rocks: [
      {
        name: "Summit Ridge Granite",
        type: "Igneous",
        color1: "#fcd9a8",
        color2: "#c98b3c",
        note: "Coarse, frost-shattered granite from the final ridge above 5,300m — my proudest specimen.",
      },
      {
        name: "Wind-scoured Gneiss",
        type: "Metamorphic",
        color1: "#a8a29e",
        color2: "#57534e",
        note: "Foliated gray-and-white banding, sandblasted smooth by relentless summit wind.",
      },
      {
        name: "Scree Basalt",
        type: "Igneous",
        color1: "#44403c",
        color2: "#1c1917",
        note: "Dense, dark basalt from the moonlit scree field we crossed before dawn.",
      },
    ],
  },
  {
    id: "cangshan",
    name: "Cangshan Mountains",
    chinese: "苍山",
    peak: "Malong",
    elevation: 4122,
    region: "Dali, central Yunnan",
    coords: [25.68, 100.12],
    accent: "#a78bfa",
    summary:
      "A green ridge of nineteen peaks above Erhai Lake — famous for its marble.",
    story:
      "Cangshan is the gentlest of my five, and the most beautiful to simply wander. Nineteen peaks run like a wall above Dali, with eighteen streams pouring down between them into Erhai Lake. I took the chairlift to the Cloud Traveler's Path, a cliff-hugging plank trail at around 2,600m, then hiked up through rhododendron forest. Dali's name is literally synonymous with marble in Chinese ('dali shi' means marble), and the mountain is the source. I found gorgeous offcuts near an old quarry trail — stone with landscape-like patterns that local artisans frame as paintings. This trip was less about suffering and more about collecting, sketching, and eating roses-petal cakes in town afterward.",
    rocks: [
      {
        name: "Dali Landscape Marble",
        type: "Metamorphic",
        color1: "#e5e7eb",
        color2: "#6b7280",
        note: "The famous Dali stone — gray and white swirls that look like an ink-wash mountain painting.",
      },
      {
        name: "Green Serpentine",
        type: "Metamorphic",
        color1: "#86efac",
        color2: "#15803d",
        note: "Waxy green stone from the forest trail, mottled like moss on bark.",
      },
      {
        name: "Erhai Lake Pebble",
        type: "Sedimentary",
        color1: "#bae6fd",
        color2: "#38bdf8",
        note: "A water-rounded pebble I rinsed in Erhai Lake at the foot of the range.",
      },
    ],
  },
  {
    id: "jiaozi",
    name: "Jiaozi Snow Mountain",
    chinese: "轿子雪山",
    peak: "Jiaozi",
    elevation: 4344,
    region: "Luquan, near Kunming",
    coords: [26.08, 102.85],
    accent: "#f472b6",
    summary:
      "A day-trip peak near Kunming with red-rock cliffs and winter rime ice.",
    story:
      "Jiaozi is the closest snow mountain to Kunming, so it's where I go when I only have a weekend. In winter the whole upper mountain glazes over with rime ice and frozen waterfalls, and a long boardwalk of stairs climbs to about 4,200m. What I love, though, is the contrast lower down: deep red sandstone cliffs glowing against the snow, and meadows that erupt with azaleas in spring. I scrambled off the boardwalk (carefully!) near the red cliffs to collect sandstone and a chunk of the iron-rich rock that gives the slopes their rust color. It's the perfect bookend to the bigger expeditions — small, close, and endlessly repeatable.",
    rocks: [
      {
        name: "Red Sandstone",
        type: "Sedimentary",
        color1: "#fca5a5",
        color2: "#b91c1c",
        note: "Iron-rich sandstone from the red cliffs — leaves a faint rusty streak on paper.",
      },
      {
        name: "Hematite Nodule",
        type: "Mineral",
        color1: "#9f1239",
        color2: "#4c0519",
        note: "A heavy, dark-red iron oxide nodule that's responsible for the mountain's color.",
      },
      {
        name: "Rime-frosted Conglomerate",
        type: "Sedimentary",
        color1: "#fbcfe8",
        color2: "#db2777",
        note: "Pebbly conglomerate I chipped from beside a frozen waterfall near the summit boardwalk.",
      },
    ],
  },
];
