import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { USDZLoader } from "three-usdz-loader";

let sharedUsdLoader = null;
let sharedUsdLoaderPath = null;
let usdLoadQueue = Promise.resolve();

function resolveUrl(path) {
  if (typeof window !== "undefined" && window.siteUrl) {
    return window.siteUrl(path);
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function isMobile() {
  return (
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 1024)
  );
}

function setStatus(statusEl, text) {
  if (statusEl && text) statusEl.textContent = text;
}

function getUsdLoader(wasmPath) {
  if (!sharedUsdLoader || sharedUsdLoaderPath !== wasmPath) {
    sharedUsdLoader = new USDZLoader(wasmPath);
    sharedUsdLoaderPath = wasmPath;
  }
  return sharedUsdLoader;
}

function loadUsdFile(file, group, wasmPath) {
  const run = async () => {
    const loader = getUsdLoader(wasmPath);
    try {
      return await loader.loadFile(file, group);
    } catch (err) {
      if (/memory access out of bounds/i.test(String(err?.message || err))) {
        sharedUsdLoader = null;
        sharedUsdLoaderPath = null;
      }
      throw err;
    }
  };

  const result = usdLoadQueue.then(run, run);
  usdLoadQueue = result.catch(() => {});
  return result;
}

function disposeObjectResources(root) {
  const textures = new Set();
  const materials = new Set();
  const geometries = new Set();

  root.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    const objectMaterials = Array.isArray(object.material)
      ? object.material
      : object.material
        ? [object.material]
        : [];
    for (const material of objectMaterials) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value?.isTexture) textures.add(value);
      }
    }
  });

  for (const texture of textures) texture.dispose();
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
}

function assert3dSupport(statusEl) {
  if (typeof WebGLRenderingContext === "undefined") {
    throw new Error("WebGL is not available in this browser.");
  }
  if (typeof SharedArrayBuffer === "undefined") {
    throw new Error(
      "SharedArrayBuffer unavailable — update iOS/Android or open the site directly in Safari/Chrome (not an in-app browser)."
    );
  }
  if (!window.crossOriginIsolated) {
    throw new Error(
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "3D security headers are missing — run npm.cmd start (not Live Server), then refresh."
        : "Browser security mode blocked 3D — use Safari or Chrome and refresh."
    );
  }
}

async function waitForHostSize(host) {
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

export async function mountRockViewer(
  host,
  { statusEl, wasmPath = "/wasm", modelUrl = "/models/prehnite.usdz" } = {}
) {
  const url = resolveUrl(modelUrl);
  const wasm = resolveUrl(wasmPath);
  const mobile = isMobile();

  setStatus(statusEl, mobile ? "Checking 3D support…" : "Loading 3D model…");
  assert3dSupport(statusEl);

  await waitForHostSize(host);

  const width = Math.max(host.clientWidth, 1);
  const height = Math.max(host.clientHeight, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc5cdd6);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.01, 1000);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? "low-power" : "default",
    });
  } catch (err) {
    throw new Error("Could not start WebGL on this device.");
  }

  renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 0.05;
  controls.maxDistance = 8;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const key = new THREE.DirectionalLight(0xfff8f0, 1.35);
  key.position.set(3, 4, 2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8ab4ff, 0.45);
  fill.position.set(-3, 1, -2);
  scene.add(fill);

  setStatus(statusEl, mobile ? "Downloading 3D engine (~10 MB)…" : "Loading 3D engine…");

  const group = new THREE.Group();
  scene.add(group);

  setStatus(statusEl, mobile ? "Downloading scan…" : "Loading scan…");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);

  const blob = await response.blob();
  const fileName = url.split("/").pop() || "model.usdz";
  const file = new File([blob], fileName, { type: "model/vnd.usdz+zip" });

  setStatus(statusEl, mobile ? "Processing scan…" : "Processing 3D model…");
  let usdInstance = null;
  try {
    usdInstance = await loadUsdFile(file, group, wasm);
  } catch (err) {
    controls.dispose();
    renderer.dispose();
    scene.clear();
    host.innerHTML = "";
    if (/memory access out of bounds/i.test(String(err?.message || err))) {
      throw new Error(
        "The 3D parser ran out of memory. Reload this page and open only one scan at a time."
      );
    }
    throw err;
  }

  const box = new THREE.Box3().setFromObject(group);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const dist = maxDim * 2.2;
  camera.position.set(0, maxDim * 0.15, dist);
  controls.target.set(0, 0, 0);
  controls.update();

  if (statusEl) statusEl.classList.add("hidden");

  let rafId = 0;
  let disposed = false;

  function animate() {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function onResize() {
    if (disposed || !host.isConnected) return;
    const w = Math.max(host.clientWidth, 1);
    const h = Math.max(host.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    disposeObjectResources(group);
    try {
      usdInstance?.clear?.();
    } catch (err) {
      console.warn("Could not fully release the USDZ model", err);
    }
    controls.dispose();
    renderer.dispose();
    scene.clear();
    window.removeEventListener("resize", onResize);
    host.innerHTML = "";
  }

  return { scene, camera, renderer, controls, group, dispose };
}
