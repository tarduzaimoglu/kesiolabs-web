/// <reference lib="webworker" />
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { computeMetricsFromGeometry } from "./stlMetrics";

type Req = { type: "parse"; url: string };
type Res =
  | { type: "ok"; metrics: { volumeMM3: number; saMM2: number; sahMM2: number }; bounds: { width: number; height: number; depth: number; centerY: number; yOffset: number } }
  | { type: "err"; code: string };

function isIOS() {
  const ua = self.navigator?.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

const IOS_MAX_VERTICES = 800_000;

self.onmessage = async (ev: MessageEvent<Req>) => {
  const msg = ev.data;
  if (msg.type !== "parse") return;

  try {
    const loader = new STLLoader();

    // STLLoader URL ister; worker içinde de çalışır.
    const geometry: THREE.BufferGeometry = await new Promise((resolve, reject) => {
      loader.load(msg.url, resolve, undefined, reject);
    });

    // iOS erken limit
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (pos?.count && isIOS() && pos.count > IOS_MAX_VERTICES) {
      geometry.dispose();
      self.postMessage({ type: "err", code: "TOO_COMPLEX" } as Res);
      return;
    }

    geometry.computeVertexNormals();
    geometry.center();

    const metrics = computeMetricsFromGeometry(geometry);

    geometry.computeBoundingBox();
    const bb = geometry.boundingBox;

    if (!bb) {
      geometry.dispose();
      self.postMessage({
        type: "ok",
        metrics,
        bounds: { width: 0, height: 120, depth: 0, centerY: 0, yOffset: 0 },
      } as Res);
      return;
    }

    const height = bb.max.y - bb.min.y;
    const width = bb.max.x - bb.min.x;
    const depth = bb.max.z - bb.min.z;
    const centerY = (bb.max.y + bb.min.y) * 0.5;
    const yOffset = -bb.min.y;

    geometry.dispose(); // ✅ worker içinde işi bitti

    self.postMessage({
      type: "ok",
      metrics,
      bounds: { width, height, depth, centerY, yOffset },
    } as Res);
  } catch (error: unknown) {
    const msgStr = error instanceof Error ? error.message : String(error);
    if (msgStr.includes("TOO_COMPLEX")) self.postMessage({ type: "err", code: "TOO_COMPLEX" } as Res);
    else self.postMessage({ type: "err", code: "STL_UNREADABLE" } as Res);
  }
};
