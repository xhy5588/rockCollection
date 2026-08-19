/**
 * Extract specimen photos from research-note .docx files.
 * Run: node extract-images.js
 */
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const DOCX_DIR =
  process.env.DOCX_DIR ||
  path.join("C:\\Users\\intel\\Downloads", "矿石标本笔记", "矿石标本笔记");
const OUT_DIR = path.join(__dirname, "images", "specimens");
const MANIFEST = path.join(__dirname, "images", "manifest.json");

const DOCX_TO_ID = {
  "太赫兹石矿石样本研究笔记（云南）.docx": "tanzanite-quartz",
  "异极矿矿石样本研究笔记（云南）.docx": "hemimorphite",
  "方钠石矿石样本课堂作业笔记（云南）.docx": "sodalite",
  "氟铝石膏矿石样本研究笔记（云南）.docx": "fluelite",
  "磷酸锌铜矿石样本研究笔记（云南）.docx": "phosphophyllite",
  "芬达石榴石矿石样本研究笔记（福建）.docx": "fanta-garnet",
  "萤石矿石样本研究笔记（云南）.docx": "fluorite",
  "葡萄石矿石样本研究笔记（云南）.docx": "prehnite",
  "蓝文石矿石样本研究笔记（云南）.docx": "carbonite",
  "蓝萤石矿石样本研究笔记（福建）.docx": "blue-fluorite",
  "蓝铜矿矿石样本研究笔记（云南）.docx": "azurite",
  "雌黄雄黄共生矿石样本研究笔记（云南）.docx": "orpiment-realgar",
  "黄铁矿矿石样本研究笔记（广东）.docx": "pyrite",
  "龟纹石个人收藏样本观察分析笔记（湖南）.docx": "turtle-stone",
};

/** Standalone field photos in project root (Chinese name.jpg → specimen id) */
const STANDALONE_PHOTO_MAP = {
  红刚玉: "ruby",
  桃花碧玺: "pink-tourmaline",
  斑铜矿: "bornite",
  凤凰松石: "phoenix-turquoise",
  枯方解: "calcite",
  蓝磷灰: "lazulite",
  蓝铜矿荧石共生: "azurite-fluorite",
  蓝铜矿萤石共生: "azurite-fluorite",
  Aletai: "aletai",
  "Gebel Kamil": "gebel-kamil",
  Muonionalusta: "muonionalusta",
  Uruaçu: "uruacu",
};

const IMAGE_EXT = new Set([".jpeg", ".jpg", ".png", ".gif", ".webp", ".emf", ".wmf"]);

function isUsefulImage(name, size) {
  const ext = path.extname(name).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return false;
  if (ext === ".emf" || ext === ".wmf") return false;
  return size > 8 * 1024;
}

function extractFromDocx(docxPath, id) {
  const zip = new AdmZip(docxPath);
  const entries = zip
    .getEntries()
    .filter((e) => e.entryName.startsWith("word/media/") && !e.isDirectory);

  const destDir = path.join(OUT_DIR, id);
  fs.mkdirSync(destDir, { recursive: true });

  const saved = [];
  let index = 0;
  for (const entry of entries) {
    const base = path.basename(entry.entryName);
    const size = entry.header.size;
    if (!isUsefulImage(base, size)) continue;
    index += 1;
    const ext = path.extname(base).toLowerCase() || ".jpg";
    const outName = `${String(index).padStart(2, "0")}${ext}`;
    const outPath = path.join(destDir, outName);
    fs.writeFileSync(outPath, entry.getData());
    saved.push({
      file: `images/specimens/${id}/${outName}`.replace(/\\/g, "/"),
      size,
    });
  }

  saved.sort((a, b) => b.size - a.size);
  return saved.map((x) => x.file);
}

function importStandalonePhotos(manifest) {
  for (const [base, id] of Object.entries(STANDALONE_PHOTO_MAP)) {
    let imported = false;
    for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
      const src = path.join(__dirname, `${base}${ext}`);
      if (!fs.existsSync(src)) continue;

      const destDir = path.join(OUT_DIR, id);
      fs.mkdirSync(destDir, { recursive: true });
      const outName = `01${ext}`;
      fs.copyFileSync(src, path.join(destDir, outName));
      const rel = `images/specimens/${id}/${outName}`.replace(/\\/g, "/");

      const existing = manifest[id]?.photos || [];
      if (!existing.includes(rel)) {
        manifest[id] = {
          cover: rel,
          photos: [rel, ...existing.filter((p) => p !== rel)],
        };
      }
      console.log(`${base}${ext} → ${id}`);
      imported = true;
      break;
    }
    if (!imported) continue;
  }
}

function main() {
  let manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
    : {};

  if (fs.existsSync(DOCX_DIR)) {
    manifest = {};
    const docxFiles = fs.readdirSync(DOCX_DIR).filter((f) => f.endsWith(".docx"));
    for (const file of docxFiles) {
      const id = DOCX_TO_ID[file];
      if (!id) {
        console.warn(`No id mapping for: ${file}`);
        continue;
      }
      const photos = extractFromDocx(path.join(DOCX_DIR, file), id);
      manifest[id] = {
        cover: photos[0] || null,
        photos,
      };
      console.log(`${file} → ${id}: ${photos.length} photo(s)`);
    }
  } else {
    console.warn(
      `DOCX folder not found — keeping existing manifest (${Object.keys(manifest).length} entries)`
    );
  }

  importStandalonePhotos(manifest);

  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`\nWrote ${Object.keys(manifest).length} entries to ${MANIFEST}`);
}

main();
