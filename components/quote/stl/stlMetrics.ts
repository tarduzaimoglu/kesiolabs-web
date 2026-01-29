import * as THREE from "three";

export const MAX_VERTICES = 2_000_000;

export function computeMetricsFromGeometry(geom: THREE.BufferGeometry) {
  // ✅ iOS için kritik: non-indexed ise ASLA clone yapma
  // Index varsa non-indexed'e çevirmek metrik için gerekli olabilir.
  const g = geom.index ? geom.toNonIndexed() : geom;

  const pos = g.getAttribute("position");
  if (!pos) throw new Error("NO_POSITION");

  const vertexCount = pos.count;
  if (vertexCount > MAX_VERTICES) throw new Error("TOO_COMPLEX");

  let volume = 0;
  let area = 0;
  let horizArea = 0;

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const cross = new THREE.Vector3();

  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos as any, i);
    b.fromBufferAttribute(pos as any, i + 1);
    c.fromBufferAttribute(pos as any, i + 2);

    ab.subVectors(b, a);
    ac.subVectors(c, a);
    cross.crossVectors(ab, ac);

    const crossLen = cross.length();
    const triArea = crossLen * 0.5;
    area += triArea;

    // Signed volume contribution
    volume += a.dot(cross) / 6.0;

    // ✅ normalize() yerine: abs(n.y) = abs(cross.y)/|cross|
    if (crossLen > 0) {
      const horizWeight = Math.abs(cross.y) / crossLen;
      horizArea += triArea * horizWeight;
    }
  }

  return {
    volumeMM3: Math.abs(volume),
    saMM2: area,
    sahMM2: horizArea,
  };
}
