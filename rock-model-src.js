import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { USDZLoader } from "three-usdz-loader";

export async function mountRockViewer(
  host,
  { statusEl, wasmPath = "/wasm", modelUrl = "/models/prehnite.usdz" } = {}
) {
  const url = modelUrl.startsWith("/") ? modelUrl : `/${modelUrl}`;

  await new Promise((resolve) => {
    if (host.clientWidth > 0 && host.clientHeight > 0) {
      resolve();
      return;
    }
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
    }, 3000);
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc5cdd6);

  const camera = new THREE.PerspectiveCamera(
    42,
    host.clientWidth / host.clientHeight,
    0.01,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 0.05;
  controls.maxDistance = 8;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;

  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const key = new THREE.DirectionalLight(0xfff8f0, 1.35);
  key.position.set(3, 4, 2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x8ab4ff, 0.45);
  fill.position.set(-3, 1, -2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(0, 2, -4);
  scene.add(rim);

  const loader = new USDZLoader(wasmPath);
  const group = new THREE.Group();
  scene.add(group);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);

  const blob = await response.blob();
  const fileName = url.split("/").pop() || "model.usdz";
  const file = new File([blob], fileName, { type: "model/vnd.usdz+zip" });
  await loader.loadFile(file, group);

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
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  }
  window.addEventListener("resize", onResize);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    controls.dispose();
    renderer.dispose();
    window.removeEventListener("resize", onResize);
    host.innerHTML = "";
  }

  return { scene, camera, renderer, controls, group, dispose };
}
