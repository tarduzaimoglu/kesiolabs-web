import * as THREE from "three";

export const MAX_VERTICES = 2_000_000;

// iOS için güvenli üçgen limiti (istersen ayarla)
const MAX_TRIANGLES = 1_200_000;

export function computeMetricsFromGeometry(geom: THREE.BufferGeometry) {
  const pos = geom.getAttribute("position") as THREE.BufferAttribute | undefined;
  if (!pos) throw new Error("NO_POSITION");

  if (pos.count > MAX_VERTICES) throw new Error("TOO_COMPLEX");

  const index = geom.getIndex();
  const triCount = index ? index.count / 3 : pos.count / 3;
  if (triCount > MAX_TRIANGLES) throw new Error("TOO_COMPLEX");

  let volume = 0;
  let area = 0;
  let horizArea = 0;

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const cross = new THREE.Vector3();

  const setV = (i: number, out: THREE.Vector3) => {
    out.set(pos.getX(i), pos.getY(i), pos.getZ(i));
  };

  const triLoop = (fn: (i0: number, i1: number, i2: number) => void) => {
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        fn(index.getX(i), index.getX(i + 1), index.getX(i + 2));
      }
    } else {
      for (let i = 0; i < pos.count; i += 3) {
        fn(i, i + 1, i + 2);
      }
    }
  };

  triLoop((i0, i1, i2) => {
    setV(i0, a);
    setV(i1, b);
    setV(i2, c);

    ab.subVectors(b, a);
    ac.subVectors(c, a);
    cross.crossVectors(ab, ac);

    const crossLen = cross.length();
    const triArea = crossLen * 0.5;
    area += triArea;

    volume += a.dot(cross) / 6.0;

    if (crossLen > 0) {
      // senin mevcut yaklaşımını koruyoruz
      const horizWeight = Math.abs(cross.y) / crossLen;
      horizArea += triArea * horizWeight;
    }
  });

  return {
    volumeMM3: Math.abs(volume),
    saMM2: area,
    sahMM2: horizArea,
  };
}
