/**
 * Builds data.js from extracted Chinese research notes.
 * Run: node build-data.js
 */
const fs = require("fs");
const path = require("path");

const NOTES_DIR = path.join(__dirname, "notes-extract");

const META = {
  "太赫兹石矿石样本研究笔记（云南）.txt": {
    id: "tanzanite-quartz",
    nameEn: "Terahertz Stone",
    nameZh: "太赫兹石",
    classEn: "Silica · Microcrystalline quartz",
    classZh: "二氧化硅类 · 隐晶质石英",
    localityEn: "Dongchuan, Yunnan",
    localityZh: "云南东川区",
    province: "yunnan",
    coords: [26.08, 103.18],
    accent: "#6366f1",
    color1: "#374151",
    color2: "#1e1b4b",
  },
  "异极矿矿石样本研究笔记（云南）.txt": {
    id: "hemimorphite",
    nameEn: "Hemimorphite",
    nameZh: "异极矿",
    classEn: "Silicate · Monoclinic",
    classZh: "硅酸盐 · 单斜晶系",
    localityEn: "Ailao Mountains, Yunnan",
    localityZh: "云南哀牢山",
    province: "yunnan",
    coords: [24.35, 101.62],
    accent: "#38bdf8",
    color1: "#7dd3fc",
    color2: "#0369a1",
  },
  "方钠石矿石样本课堂作业笔记（云南）.txt": {
    id: "sodalite",
    nameEn: "Sodalite",
    nameZh: "方钠石",
    classEn: "Silicate · Trigonal",
    classZh: "硅酸盐 · 三方晶系",
    localityEn: "Baiyun Mountain, Gejiu, Yunnan",
    localityZh: "云南个旧市白云山",
    province: "yunnan",
    coords: [23.36, 103.15],
    accent: "#818cf8",
    color1: "#6366f1",
    color2: "#312e81",
  },
  "氟铝石膏矿石样本研究笔记（云南）.txt": {
    id: "fluelite",
    nameEn: "Fluelite",
    nameZh: "氟铝石膏",
    classEn: "Aluminum fluorophosphate · Monoclinic",
    classZh: "铝氟磷酸盐 · 单斜晶系",
    localityEn: "Wenshan, Yunnan",
    localityZh: "云南文山州",
    province: "yunnan",
    coords: [23.37, 104.25],
    accent: "#f59e0b",
    color1: "#fcd34d",
    color2: "#d97706",
  },
  "磷酸锌铜矿石样本研究笔记（云南）.txt": {
    id: "phosphophyllite",
    nameEn: "Phosphophyllite",
    nameZh: "磷酸锌铜",
    classEn: "Copper-zinc phosphate · Orthorhombic",
    classZh: "铜锌磷酸盐 · 斜方晶系",
    localityEn: "Dongchuan, Yunnan",
    localityZh: "云南昆明市东川区",
    province: "yunnan",
    coords: [26.07, 103.2],
    accent: "#f472b6",
    color1: "#fb7185",
    color2: "#be123c",
  },
  "芬达石榴石矿石样本研究笔记（福建）.txt": {
    id: "fanta-garnet",
    nameEn: "Fanta Garnet",
    nameZh: "芬达石榴石",
    classEn: "Garnet · Pyrope-almandine variety",
    classZh: "镁铝榴石变种",
    localityEn: "Yunxiao, Zhangzhou, Fujian",
    localityZh: "福建漳州市云霄县",
    province: "fujian",
    coords: [23.95, 117.33],
    accent: "#f97316",
    color1: "#fb923c",
    color2: "#c2410c",
  },
  "萤石矿石样本研究笔记（云南）.txt": {
    id: "fluorite",
    nameEn: "Fluorite",
    nameZh: "萤石",
    classEn: "Halide · Cubic",
    classZh: "氟化钙 · 立方晶系",
    localityEn: "Tengchong, Yunnan",
    localityZh: "云南保山市腾冲县",
    province: "yunnan",
    coords: [25.02, 98.49],
    accent: "#a78bfa",
    color1: "#c4b5fd",
    color2: "#7c3aed",
  },
  "葡萄石矿石样本研究笔记（云南）.txt": {
    id: "prehnite",
    nameEn: "Prehnite",
    nameZh: "葡萄石",
    classEn: "Silicate · Inosilicate",
    classZh: "硅酸盐类矿物",
    localityEn: "Qiaojia, Zhaotong, Yunnan",
    localityZh: "云南昭通市巧家县",
    province: "yunnan",
    coords: [26.91, 102.93],
    accent: "#34d399",
    color1: "#86efac",
    color2: "#059669",
  },
  "蓝文石矿石样本研究笔记（云南）.txt": {
    id: "carbonite",
    nameEn: "Carbonte / Blue Carbonate",
    nameZh: "蓝文石",
    classEn: "Barium-calcium carbonate",
    classZh: "含钡钙碳酸盐矿物",
    localityEn: "Wenshan, Yunnan",
    localityZh: "云南文山州",
    province: "yunnan",
    coords: [23.38, 104.22],
    accent: "#2dd4bf",
    color1: "#99f6e4",
    color2: "#0f766e",
  },
  "蓝萤石矿石样本研究笔记（福建）.txt": {
    id: "blue-fluorite",
    nameEn: "Blue Fluorite",
    nameZh: "蓝萤石",
    classEn: "Halide · Cubic",
    classZh: "氟化钙 · 等轴晶系",
    localityEn: "Yongchun, Quanzhou, Fujian",
    localityZh: "福建泉州市永春县",
    province: "fujian",
    coords: [25.32, 118.29],
    accent: "#22d3ee",
    color1: "#67e8f9",
    color2: "#0891b2",
  },
  "蓝铜矿矿石样本研究笔记（云南）.txt": {
    id: "azurite",
    nameEn: "Azurite",
    nameZh: "蓝铜矿",
    classEn: "Carbonate · Monoclinic",
    classZh: "碳酸铜 · 单斜晶系",
    localityEn: "Ailao Mountains, Yunnan",
    localityZh: "云南哀牢山",
    province: "yunnan",
    coords: [24.33, 101.58],
    accent: "#2563eb",
    color1: "#3b82f6",
    color2: "#1e3a8a",
  },
  "雌黄雄黄共生矿石样本研究笔记（云南）.txt": {
    id: "orpiment-realgar",
    nameEn: "Orpiment & Realgar",
    nameZh: "雌黄雄黄共生矿",
    classEn: "Arsenic sulfides · Monoclinic",
    classZh: "砷硫化物 · 单斜晶系",
    localityEn: "Nanhua, Yunnan",
    localityZh: "云南南华县",
    province: "yunnan",
    coords: [25.19, 101.27],
    accent: "#eab308",
    color1: "#fde047",
    color2: "#a16207",
  },
  "黄铁矿矿石样本研究笔记（广东）.txt": {
    id: "pyrite",
    nameEn: "Pyrite",
    nameZh: "黄铁矿",
    classEn: "Sulfide · Cubic",
    classZh: "硫化物 · 等轴晶系",
    localityEn: "Dabaoshan, Shaoguan, Guangdong",
    localityZh: "广东韶关市大宝山",
    province: "guangdong",
    coords: [24.75, 113.65],
    accent: "#ca8a04",
    color1: "#facc15",
    color2: "#854d0e",
  },
  "龟纹石个人收藏样本观察分析笔记（湖南）.txt": {
    id: "turtle-stone",
    nameEn: "Turtle Stone (Iron Nodule)",
    nameZh: "龟纹石",
    classEn: "Iron nodule · Permian Longtan Fm.",
    classZh: "铁胆石 · 二叠纪龙潭组",
    localityEn: "Wushui River, Chenzhou, Hunan",
    localityZh: "湖南郴州武水流域",
    province: "hunan",
    coords: [25.77, 113.02],
    accent: "#78716c",
    color1: "#d6d3d1",
    color2: "#292524",
  },
};

/** Specimens with 3D scans but no research-note .txt or field photos */
const SCAN_ONLY = [
  {
    id: "bornite",
    nameEn: "Bornite",
    nameZh: "斑铜矿",
    classEn: "Copper iron sulfide · Orthorhombic",
    classZh: "铜铁硫化物 · 斜方晶系",
    localityEn: "Dongchuan copper belt, Yunnan",
    localityZh: "云南东川铜矿带",
    province: "yunnan",
    coords: [26.06, 103.19],
    accent: "#a855f7",
    color1: "#c084fc",
    color2: "#6b21a8",
    summary: {
      en: "Peacock-bornite from Yunnan's copper districts — natural metallic surfaces with purple-blue tarnish. 3D scan only; field photo pending.",
      zh: "来自云南铜矿区的斑铜矿标本，保留天然金属光泽与紫蓝氧化色斑。目前仅有 3D 扫描，野外照片待补充。",
    },
    appearance: {
      en: "Brassy to purple-blue iridescence on fractured surfaces; dense metallic texture typical of copper sulfide ore.",
      zh: "断面可见黄铜色至紫蓝色金属光泽，质地致密，为典型铜硫化物矿石外观。",
    },
    formation: {
      en: "Copper-iron sulfide crystallized in hydrothermal veins, later oxidized at fractures to produce iridescent tarnish.",
      zh: "铜铁硫化物在热液脉中结晶，裂隙部位后期氧化形成彩色氧化膜。",
    },
    geology: {
      en: "Yunnan's polymetallic belts host bornite alongside chalcopyrite and azurite in oxidation zones.",
      zh: "云南多金属矿带中，斑铜矿常与黄铜矿、蓝铜矿等共生，多见于氧化带。",
    },
  },
  {
    id: "ruby",
    nameEn: "Ruby (Corundum)",
    nameZh: "红刚玉",
    classEn: "Oxide · Trigonal corundum",
    classZh: "氧化物 · 三方晶系刚玉",
    localityEn: "Yunnan",
    localityZh: "云南",
    province: "yunnan",
    coords: [25.04, 99.17],
    accent: "#dc2626",
    color1: "#f87171",
    color2: "#991b1b",
    summary: {
      en: "Red corundum variety from the collection — scanned in 3D. Field notes and photo to be added.",
      zh: "收藏中的红色刚玉变种，已完成 3D 扫描。野外笔记与照片待补充。",
    },
    appearance: {
      en: "Deep red, vitreous to sub-adamantine luster; hard, dense corundum with natural crystal faces or fracture.",
      zh: "深红色，玻璃至亚金刚光泽，硬度高，可见天然晶面或断口。",
    },
    formation: {
      en: "Aluminum-rich melts or metamorphic fluids crystallized corundum; trace chromium produced the red color.",
      zh: "富铝熔体或变质流体结晶形成刚玉，微量铬致红色。",
    },
    geology: {
      en: "Corundum occurs in metamorphic and basalt-related settings across southwest China.",
      zh: "刚玉常见于西南地区的变质岩与基性岩相关地质环境中。",
    },
  },
  {
    id: "pink-tourmaline",
    nameEn: "Pink Tourmaline",
    nameZh: "桃花碧玺",
    classEn: "Silicate · Tourmaline group",
    classZh: "硅酸盐 · 电气石族",
    localityEn: "Yunnan",
    localityZh: "云南",
    province: "yunnan",
    coords: [24.52, 102.35],
    accent: "#ec4899",
    color1: "#f9a8d4",
    color2: "#be185d",
    summary: {
      en: "Pink tourmaline specimen with peach-rose tones — 3D photogrammetry scan from the personal collection.",
      zh: "粉色调碧玺标本，带桃花玫瑰色。来自个人收藏的 3D 光度测量扫描。",
    },
    appearance: {
      en: "Translucent pink with peach highlights; prismatic habit and glass luster typical of tourmaline.",
      zh: "半透明粉色，泛桃花色调，柱状晶形，玻璃光泽。",
    },
    formation: {
      en: "Boron-bearing pegmatitic fluids crystallized tourmaline in cavities and veins during late magmatic stages.",
      zh: "含硼伟晶质流体在岩浆晚期于孔洞与裂隙中结晶电气石。",
    },
    geology: {
      en: "Granitic pegmatites in Yunnan often yield colored tourmaline crystals.",
      zh: "云南花岗伟晶岩中常见有色电气石晶体。",
    },
  },
  {
    id: "calcite",
    nameEn: "Weathered Calcite",
    nameZh: "枯方解",
    classEn: "Carbonate · Trigonal",
    classZh: "碳酸盐 · 三方晶系",
    localityEn: "Yunnan",
    localityZh: "云南",
    province: "yunnan",
    coords: [23.4, 104.2],
    accent: "#d6d3d1",
    color1: "#f5f5f4",
    color2: "#78716c",
    summary: {
      en: "Weathered calcite with muted 'withered' tones — 3D scan preserved; field documentation pending.",
      zh: "风化色调的方解石标本，呈枯黄色调。已保留 3D 扫描，野外记录待补充。",
    },
    appearance: {
      en: "Dull ivory to tan; earthy weathered surfaces with rhombohedral cleavage traces.",
      zh: "枯白至土黄色，表面风化暗淡，可见菱形解理痕迹。",
    },
    formation: {
      en: "Primary calcite in limestone or veins was altered by surface weathering and iron staining.",
      zh: "灰岩或脉中方解石经地表风化与铁质浸染形成枯黄色外观。",
    },
    geology: {
      en: "Carbonate provinces in Yunnan provide abundant calcite in karst and hydrothermal settings.",
      zh: "云南碳酸盐岩省份中，方解石广泛见于喀斯特与热液环境。",
    },
  },
  {
    id: "lazulite",
    nameEn: "Lazulite",
    nameZh: "蓝磷灰",
    classEn: "Phosphate · Monoclinic",
    classZh: "磷酸盐 · 单斜晶系",
    localityEn: "Yunnan",
    localityZh: "云南",
    province: "yunnan",
    coords: [23.39, 104.18],
    accent: "#0284c7",
    color1: "#38bdf8",
    color2: "#075985",
    summary: {
      en: "Blue phosphate mineral (lazulite) — 3D scan from collection. Bilingual field notes pending.",
      zh: "蓝色磷酸盐矿物（天蓝石/蓝磷灰类）。来自收藏的 3D 扫描，中英笔记待补充。",
    },
    appearance: {
      en: "Soft powder-blue aggregates; vitreous to dull luster on compact phosphate masses.",
      zh: "柔和粉蓝色集合体，致密块体呈玻璃至暗淡光泽。",
    },
    formation: {
      en: "Phosphate-rich fluids met aluminum-bearing rocks under moderate temperatures, crystallizing lazulite.",
      zh: "富磷流体在中温条件下与含铝岩石反应结晶磷酸盐矿物。",
    },
    geology: {
      en: "Metamorphic and hydrothermal phosphate associations occur in southwest China.",
      zh: "西南地区变质与热液环境可见磷酸盐矿物组合。",
    },
  },
  {
    id: "phoenix-turquoise",
    nameEn: "Phoenix Turquoise",
    nameZh: "凤凰松石",
    classEn: "Phosphate · Turquoise group",
    classZh: "磷酸盐 · 绿松石族",
    localityEn: "China",
    localityZh: "中国",
    province: "hunan",
    coords: [27.8, 109.7],
    accent: "#14b8a6",
    color1: "#5eead4",
    color2: "#0f766e",
    summary: {
      en: "Named turquoise variety with green-blue matrix — 3D scan only in this journal so far.",
      zh: "绿蓝色基质的绿松石类标本。目前网站仅收录其 3D 扫描。",
    },
    appearance: {
      en: "Green-blue cryptocrystalline mass; waxy luster and porous texture typical of turquoise.",
      zh: "绿蓝色隐晶质块体，蜡状光泽，具绿松石典型孔隙结构。",
    },
    formation: {
      en: "Copper-rich groundwater altered phosphate-bearing rock in near-surface oxidation zones.",
      zh: "含铜地下水在近表氧化带蚀变含磷岩石形成绿松石类矿物。",
    },
    geology: {
      en: "Turquoise forms in arid to semi-arid oxidation settings where copper and phosphorus meet.",
      zh: "绿松石形成于铜与磷相遇的干旱至半干旱氧化环境。",
    },
  },
  {
    id: "azurite-fluorite",
    nameEn: "Azurite–Fluorite Paragenesis",
    nameZh: "蓝铜矿荧石共生",
    classEn: "Carbonate + halide association",
    classZh: "碳酸盐与氟化物共生",
    localityEn: "Ailao Mountains, Yunnan",
    localityZh: "云南哀牢山",
    province: "yunnan",
    coords: [24.34, 101.6],
    accent: "#4f46e5",
    color1: "#818cf8",
    color2: "#312e81",
    summary: {
      en: "Natural azurite and fluorite grown together on host rock — multi-mineral 3D scan from the collection.",
      zh: "蓝铜矿与萤石天然共生于围岩之上。来自收藏的多矿物 3D 扫描。",
    },
    appearance: {
      en: "Deep blue azurite with purple-green fluorite cubes on tan matrix; classic paragenetic contrast.",
      zh: "深蓝蓝铜矿与紫绿萤石立方体共生于浅色围岩，共生对比明显。",
    },
    formation: {
      en: "Separate hydrothermal pulses deposited copper carbonates and fluorite in the same fracture system.",
      zh: "多期热液在同一裂隙系统中先后沉淀铜碳酸盐与萤石。",
    },
    geology: {
      en: "Ailao Shan fracture networks channel both Cu-rich and F-rich fluids — ideal for this association.",
      zh: "哀牢山裂隙系统同时导通富铜与富氟流体，利于此类共生组合。",
    },
  },
];

const EN = {
  "太赫兹石矿石样本研究笔记（云南）.txt": {
    summary:
      "Field-collected from Dongchuan, Yunnan. Unpolished, natural fracture surfaces — all observations from my own sampling and photography.",
    appearance:
      "Deep gray-black with blue-purple metallic luster; conchoidal fracture, shell-like texture, dense microcrystalline quartz structure.",
    formation:
      "Silica recrystallized under high temperature and pressure, then fractured by tectonic stress into blocky pieces with conchoidal breaks.",
    geology:
      "Yunnan's active tectonics and deep silica-rich environments favored dense quartz formation; later stress shattered crystals while preserving fresh fracture faces.",
  },
  "异极矿矿石样本研究笔记（云南）.txt": {
    summary:
      "Self-collected hemimorphite from the Ailao Mountains. Natural crystal clusters with host-rock inclusions — no polishing or prep.",
    appearance:
      "Pale sky-blue, semi-transparent clusters; glass luster, radiating plate-like crystals with brown host-rock fragments.",
    formation:
      "Zinc leached from surface rocks into acidic groundwater, reacted with silicates in fractures, and crystallized as layered, radiating clusters.",
    geology:
      "Ailao Shan lies in a collision zone with abundant fractures and zinc-bearing veins — humid climate accelerates weathering and secondary mineral growth.",
  },
  "方钠石矿石样本课堂作业笔记（云南）.txt": {
    summary:
      "Collected at Baiyun Mountain, Gejiu — a classic alkaline-rock sodalite locality. Natural, unmodified specimen.",
    appearance:
      "Deep gray-blue with lighter blue-white spots; vitreous luster, white veins along fractures, cryptic crystalline aggregate.",
    formation:
      "Alkaline magma cooled and crystallized; sodium, aluminum, and silicon combined as sodalite intergrown with host rock.",
    geology:
      "Frequent magmatic activity in Yunnan provided alkaline melts and the chemical budget for feldspathoid minerals like sodalite.",
  },
  "氟铝石膏矿石样本研究笔记（云南）.txt": {
    summary:
      "Collected in Wenshan, Yunnan. A bright golden-orange fibrous aggregate in natural growth form.",
    appearance:
      "Golden to orange-yellow; resinous to vitreous luster, parallel fibrous layers, no obvious weathering.",
    formation:
      "Aluminum, fluorine, and phosphorus mobilized by weathering or hydrothermal fluids, precipitated in fractures as oriented fibrous crystals.",
    geology:
      "Wenshan's altered rock packages and fracture networks channel mineralizing fluids that deposit secondary phosphates and sulfates.",
  },
  "磷酸锌铜矿石样本研究笔记（云南）.txt": {
    summary:
      "From Dongchuan — China's best-known phosphophyllite locality. Collected in situ on host rock, unpolished.",
    appearance:
      "Vivid rose-red microcrystals on tan host rock; glass luster, velvety granular texture, occasional green associates.",
    formation:
      "Copper-zinc sulfides weathered at surface; elements migrated into fractures and reprecipitated as rose-red phosphate crusts.",
    geology:
      "Dongchuan's oxidized zones above sulfide veins create ideal conditions for rare copper-zinc phosphates.",
  },
  "芬达石榴石矿石样本研究笔记（福建）.txt": {
    summary:
      "Collected at Yunxiao, Fujian with a local friend — famous 'Fanta orange' pyrope-almandine garnet on white host rock.",
    appearance:
      "Saturated orange-red euhedral crystals; glass luster on smooth faces, sharp contrast with rough beige matrix.",
    formation:
      "Contact metamorphism of magnesium-rich sediments produced euhedral garnet crystals in voids and fractures.",
    geology:
      "Fujian's magmatic intrusions into Mg-rich wall rocks supplied heat and chemistry for classic garnet skarn assemblages.",
  },
  "萤石矿石样本研究笔记（云南）.txt": {
    summary:
      "Field-collected purple fluorite cluster from Tengchong, western Yunnan fluorite belt.",
    appearance:
      "Semi-transparent lilac cubes; glass luster, clear cleavage, intergrown cluster with minor tan matrix.",
    formation:
      "F-rich hydrothermal fluids moved up fault zones, cooled, and deposited CaF₂ as stacked cubic crystals.",
    geology:
      "Tengchong sits in a collision-related fracture network — ideal conduits for fluorite-forming hydrothermal systems.",
  },
  "葡萄石矿石样本研究笔记（云南）.txt": {
    summary:
      "Collected at Qiaojia, Zhaotong. Natural botryoidal prehnite aggregate with host-rock base.",
    appearance:
      "Soft yellow-green, semi-transparent; glass luster, classic grape-like botryoidal surface.",
    formation:
      "Low-temperature hydrothermal fluids altered basic rock, mobilized Ca-Al-Si, and crystallized radiating fibrous spheres.",
    geology:
      "Yunnan's basic and ultrabasic rocks plus multi-phase hydrothermal activity favor prehnite in near-surface fracture fills.",
  },
  "蓝文石矿石样本研究笔记（云南）.txt": {
    summary:
      "Collected in Wenshan. Pale green-blue carbonate filling a fracture — natural, unpolished.",
    appearance:
      "Soft blue-green to white gradient; vitreous luster, stalactitic/layered fill texture on host rock.",
    formation:
      "Groundwater dissolved Ba and Ca from carbonate beds, migrated into fractures, and deposited banded carbonate crusts.",
    geology:
      "Widespread carbonate strata in Wenshan provide both host rock and dissolved ions for secondary Ba-Ca carbonate minerals.",
  },
  "蓝萤石矿石样本研究笔记（福建）.txt": {
    summary:
      "From Yongchun, Fujian — famous 'tanzanite-blue' fluorite locality. Natural cleavage fragments.",
    appearance:
      "Blue-green, semi-transparent; glass luster, prominent cubic cleavage planes and parallel striations.",
    formation:
      "F-bearing hydrothermal fluids rose along faults; Ca and F combined as fluorite with classic cubic cleavage.",
    geology:
      "Fujian's fracture systems channel fluorine-rich fluids from depth into shallow crystallization sites.",
  },
  "蓝铜矿矿石样本研究笔记（云南）.txt": {
    summary:
      "Azurite from Ailao Shan collected on natural host rock — powdery and botryoidal blue on tan matrix.",
    appearance:
      "Deep blue azurite on brown host; vitreous to silky luster, granular and botryoidal coatings in pores.",
    formation:
      "Copper sulfides oxidized at surface; Cu-rich fluids precipitated carbonate minerals in rock fractures.",
    geology:
      "Ailao's copper veins and intense weathering build thick oxidation zones where azurite commonly forms.",
  },
  "雌黄雄黄共生矿石样本研究笔记（云南）.txt": {
    summary:
      "Orpiment-realgar assemblage from Nanhua arsenic belt — natural multi-mineral cluster, unmodified.",
    appearance:
      "Purple-brown, ochre, and white matrix; waxy luster on yellow and purple crystal points, porous fracture fill.",
    formation:
      "Low-temperature hydrothermal arsenic sulfides filled veinlets alongside gangue and companion minerals.",
    geology:
      "Nanhua's famous arsenic belt hosts repeated hydrothermal pulses that produce classic realgar-orpiment associations.",
  },
  "黄铁矿矿石样本研究笔记（广东）.txt": {
    summary:
      "Euhedral pyrite cube from Dabaoshan, Shaoguan — 'fool's gold' with sharp crystal faces.",
    appearance:
      "Brassy yellow metallic luster; perfect cubic habit, parallel growth striations, minor oxidation stains.",
    formation:
      "Iron- and sulfur-rich hydrothermal fluids cooled in fractures; pyrite crystallized as stable cubic crystals.",
    geology:
      "Guangdong's fault networks deliver sulfide-bearing fluids into shallow zones where pyrite grows freely.",
  },
  "龟纹石个人收藏样本观察分析笔记（湖南）.txt": {
    summary:
      "Personal collection piece from the Wushui River, Chenzhou — natural iron nodule ('turtle stone') from Permian strata.",
    appearance:
      "Dark gray-black body with yellow-white net veins mimicking turtle shell; dense, hard, polygonal crack network.",
    formation:
      "Syneresis and iron-rich groundwater deposited concentric layers around a nucleus, then cracked on drying into 'turtle' patterns.",
    geology:
      "Chenzhou's Permian Longtan Formation nodules formed in reducing sedimentary environments rich in iron and silica.",
  },
};

function section(text, heading) {
  const idx = text.indexOf(heading);
  if (idx === -1) return "";
  const rest = text.slice(idx + heading.length);
  const next = rest.search(/\n[一二三四五六]、/);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function subsection(block, heading) {
  const idx = block.indexOf(heading);
  if (idx === -1) return "";
  const rest = block.slice(idx + heading.length);
  const next = rest.search(/\n[1-9]\./);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function extractAppearance(text) {
  const block =
    section(text, "二、矿石外观、纹理与结构观察") ||
    section(text, "二、样本外观特征实地观察");
  if (!block) return "";
  const parts = [
    subsection(block, "1.颜色"),
    subsection(block, "1.颜色特征"),
    subsection(block, "2.纹理与表面特征"),
    subsection(block, "2.纹理特征"),
    subsection(block, "3.结构形态"),
    subsection(block, "3.结构特征"),
  ].filter(Boolean);
  return [...new Set(parts)].join("\n\n");
}

function buildScanOnlySpecimen(entry, manifest) {
  const images = manifest[entry.id] || { cover: null, photos: [] };
  return {
    id: entry.id,
    name: { en: entry.nameEn, zh: entry.nameZh },
    mineralClass: { en: entry.classEn, zh: entry.classZh },
    locality: { en: entry.localityEn, zh: entry.localityZh },
    province: entry.province,
    coords: entry.coords,
    accent: entry.accent,
    color1: entry.color1,
    color2: entry.color2,
    cover: images.cover || null,
    photos: images.photos || [],
    model3d: modelForSpecimen(entry.id),
    summary: entry.summary,
    appearance: entry.appearance,
    formation: entry.formation,
    geology: entry.geology,
  };
}

function buildSpecimen(filename, text, manifest) {
  const meta = META[filename];
  const en = EN[filename];
  const basic = section(text, "一、样本基础信息");
  const appearanceZh = extractAppearance(text);
  const formation = section(text, "三、形成过程推测");
  const geology = section(text, "四、与区域地质构造的关联");
  const images = manifest[meta.id] || { cover: null, photos: [] };

  return {
    id: meta.id,
    name: { en: meta.nameEn, zh: meta.nameZh },
    mineralClass: { en: meta.classEn, zh: meta.classZh },
    locality: { en: meta.localityEn, zh: meta.localityZh },
    province: meta.province,
    coords: meta.coords,
    accent: meta.accent,
    color1: meta.color1,
    color2: meta.color2,
    cover: images.cover,
    photos: images.photos,
    model3d: modelForSpecimen(meta.id),
    summary: { en: en.summary, zh: basic.split("\n").filter(Boolean).slice(-1)[0] || basic.slice(0, 200) },
    appearance: { en: en.appearance, zh: appearanceZh.slice(0, 500) },
    formation: {
      en: en.formation,
      zh: formation.replace(/^（自主分析）/, "").slice(0, 500),
    },
    geology: { en: en.geology, zh: geology.slice(0, 500) },
  };
}

const manifestPath = path.join(__dirname, "images", "manifest.json");
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

const MODELS_DIR = path.join(__dirname, "models");

function modelForSpecimen(id) {
  const rel = `models/${id}.usdz`;
  return fs.existsSync(path.join(MODELS_DIR, `${id}.usdz`)) ? rel : null;
}

const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith(".txt"));
const noteSpecimens = files.map((f) => {
  const text = fs.readFileSync(path.join(NOTES_DIR, f), "utf8");
  return buildSpecimen(f, text, manifest);
});

const scanOnlySpecimens = SCAN_ONLY.map((entry) => buildScanOnlySpecimen(entry, manifest));
const specimens = [...noteSpecimens, ...scanOnlySpecimens];
specimens.sort((a, b) => a.name.zh.localeCompare(b.name.zh, "zh"));

const out = `// Auto-generated from research notes — run: node build-data.js
// Real field-collected mineral specimens from personal research notebooks.

const SPECIMENS = ${JSON.stringify(specimens, null, 2)};

const UI_STRINGS = {
  en: {
    brand: "Peaks & Pebbles",
    map: "Collection Map",
    specimen3d: "3D Scan",
    collection: "Full Collection",
    about: "About",
    eyebrow: "Field notes · Yunnan & beyond",
    heroTitle: "Real Rocks,<br />Real Field Notes",
    heroLede:
      "A personal mineral collection built from my own sampling trips across Yunnan, Fujian, Guangdong, and Hunan. Tap any marker to read the bilingual research notes for each specimen.",
    heroCta: "Explore the map ↓",
    mapTitle: "Collection Map",
    mapSub: "Click a marker to open field notes for that specimen.",
    mapPlaceholder: "Select a specimen on the map to begin.",
    specimenTitle: "3D Rock Scan",
    specimenSub:
      "Photogrammetry scan of a field specimen — rotate to inspect. On iPhone, use AR to place it in your room.",
    specimenMetaTitle: "Scanned specimen",
    specimenMeta:
      "Green rock specimen (葡萄石). Captured with Apple Object Capture — real piece from the collection.",
    specimenHint: "Run node serve.js and open http://localhost:8080 for the interactive 3D viewer.",
    openViewer: "Open full-screen 3D viewer →",
    arLink: "View in AR on iPhone →",
    collectionTitle: "Full Collection",
    collectionSub:
      "Every specimen with bilingual field notes, field photos, and 3D scans where available.",
    collectionTabPhoto: "Photo",
    collectionTab3d: "3D Scan",
    collection3dLoading: "Loading 3D model…",
    collection3dMissing: "3D scan not added yet — place models/{id}.usdz in the models folder.",
    collectionOpen3d: "Open full-screen 3D →",
    collectionView3d: "View 3D in collection ↓",
    aboutTitle: "About this journal",
    aboutText:
      "Every specimen here was located, sampled, photographed, and written up by me — from Ailao Shan hemimorphite to Chenzhou turtle stone. This site pairs my Chinese research notebooks with English translations so the collection can be shared with classmates and friends abroad.",
    statSpecimens: "specimens",
    statProvinces: "provinces",
    statField: "field-collected",
    footer: "Peaks & Pebbles · Personal mineral research journal",
    panelClass: "Mineral class",
    panelAppearance: "Appearance & structure",
    panelFormation: "Formation (hypothesis)",
    panelGeology: "Regional geology",
    panelPhotos: "Field photos",
    noFieldPhoto: "No field photo",
    langLabel: "中文",
  },
  zh: {
    brand: "峰石笔记",
    map: "标本地图",
    specimen3d: "3D 扫描",
    collection: "全部标本",
    about: "关于",
    eyebrow: "野外笔记 · 云南及周边",
    heroTitle: "真实的石头，<br />真实的笔记",
    heroLede:
      "这是我在云南、福建、广东、湖南等地亲自采集的矿石标本集。点击地图上的标记，阅读每一块标本的中英文研究笔记。",
    heroCta: "探索地图 ↓",
    mapTitle: "标本地图",
    mapSub: "点击标记查看该标本的野外研究笔记。",
    mapPlaceholder: "在地图上选择一个标本开始阅读。",
    specimenTitle: "3D 岩石扫描",
    specimenSub: "野外标本的光度测量扫描——可旋转查看。iPhone 上可使用 AR 放置。",
    specimenMetaTitle: "扫描标本",
    specimenMeta: "使用 Apple Object Capture 拍摄，来自本人收藏的真实标本。",
    specimenHint: "运行 node serve.js 后打开 http://localhost:8080 查看交互式 3D。",
    openViewer: "打开全屏 3D 查看器 →",
    arLink: "在 iPhone 上 AR 查看 →",
    collectionTitle: "全部标本",
    collectionSub: "每件标本均附有中英文笔记、野外照片，以及可用的 3D 扫描。",
    collectionTabPhoto: "照片",
    collectionTab3d: "3D 扫描",
    collection3dLoading: "正在加载 3D 模型…",
    collection3dMissing: "尚未添加 3D 扫描 — 将 models/{id}.usdz 放入 models 文件夹即可。",
    collectionOpen3d: "打开全屏 3D →",
    collectionView3d: "在标本集中查看 3D ↓",
    aboutTitle: "关于这份笔记",
    aboutText:
      "这里的每一块标本都是我亲自找点、采样、拍照并完成研究笔记的——从哀牢山异极矿到郴州龟纹石。网站将中文研究笔记与英文翻译并列，方便与同学和朋友分享。",
    statSpecimens: "件标本",
    statProvinces: "个省份",
    statField: "野外采集",
    footer: "峰石笔记 · 个人矿石研究日志",
    panelClass: "矿物分类",
    panelAppearance: "外观与结构",
    panelFormation: "形成过程（推测）",
    panelGeology: "区域地质",
    panelPhotos: "野外照片",
    noFieldPhoto: "暂无野外照片",
    langLabel: "EN",
  },
};

const MAP_CENTER = [25.5, 104.0];
`;

fs.writeFileSync(path.join(__dirname, "data.js"), out, "utf8");
console.log(`Wrote ${specimens.length} specimens to data.js`);
