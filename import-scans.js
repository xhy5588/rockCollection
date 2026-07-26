/**
 * Extract 3D scans from models/rock.zip into models/{id}.usdz
 * Run: node import-scans.js
 */
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const ZIP_CANDIDATES = [
  path.join(__dirname, "rock.zip"),
  path.join(__dirname, "models", "rock.zip"),
];
const ZIP_PATH = ZIP_CANDIDATES.find((p) => fs.existsSync(p));
const MODELS_DIR = path.join(__dirname, "models");

/** Chinese scan filename (no extension) → specimen id */
const SCAN_MAP = {
  太赫磁石: "tanzanite-quartz",
  异极矿: "hemimorphite",
  葡萄石: "prehnite",
  龟纹石: "turtle-stone",
  蓝文石: "carbonite",
  蓝铜矿: "azurite",
  蓝荧石: "blue-fluorite",
  萤石: "fluorite",
  荧石: "fluorite",
  弗铝石膏: "fluelite",
  磷酸锌铜: "phosphophyllite",
  芬达石榴石: "fanta-garnet",
  斑铜矿: "bornite",
  红刚玉: "ruby",
  桃花碧玺: "pink-tourmaline",
  枯方解: "calcite",
  蓝磷灰: "lazulite",
  凤凰松石: "phoenix-turquoise",
  蓝铜矿荧石共生: "azurite-fluorite",
};

function main() {
  if (!ZIP_PATH) {
    console.error(`Not found: ${ZIP_CANDIDATES.join(" or ")}`);
    process.exit(1);
  }

  console.log(`Using ${ZIP_PATH}`);
  const zip = new AdmZip(ZIP_PATH);
  const imported = [];

  for (const entry of zip.getEntries()) {
    if (entry.isDirectory || !entry.entryName.endsWith(".usdz")) continue;
    if (entry.entryName.includes("__MACOSX")) continue;

    const base = path.basename(entry.entryName, ".usdz");
    const id = SCAN_MAP[base];
    if (!id) {
      console.warn(`No id mapping for scan: ${base}`);
      continue;
    }

    const outPath = path.join(MODELS_DIR, `${id}.usdz`);
    fs.writeFileSync(outPath, entry.getData());
    imported.push({ base, id, bytes: entry.header.size });
    console.log(`${base}.usdz → models/${id}.usdz`);
  }

  console.log(`\nImported ${imported.length} 3D scans`);
}

main();
