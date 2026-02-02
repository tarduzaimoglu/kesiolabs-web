"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type Props = {
  fileUrl: string | null;
  colorHex: string;
  onMetrics: (m: { volumeMM3: number; saMM2: number; sahMM2: number }) => void;
  onError: (code: string) => void;
};

const BED_SIZE_MM = 256;
const GRID_DIV = 16;

function StlMeshView({
  url,
  colorHex,
  yOffset,
}: {
  url: string;
  colorHex: string;
  yOffset: number;
}) {
  const [geom, setGeom] = useState<THREE.BufferGeometry | null>(null);
  const geomRef = useRef<THREE.BufferGeometry | null>(null);

  // ✅ Material tek instance (iOS GPU leak engeli)
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null);
  if (!matRef.current) {
    matRef.current = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.05,
    });
  }
  matRef.current.color.set(colorHex);

  // ✅ Unmount/cleanup
  useEffect(() => {
    return () => {
      geomRef.current?.dispose();
      geomRef.current = null;

      matRef.current?.dispose();
      matRef.current = null;

      setGeom(null);
    };
  }, []);

  // ✅ URL değişince STL'yi yükle (sadece görüntüleme için)
  useEffect(() => {
    let cancelled = false;
    const loader = new STLLoader();

    loader.load(
      url,
      (geometry) => {
        if (cancelled) {
          geometry.dispose();
          return;
        }

        // önceki geometry'yi temizle
        geomRef.current?.dispose();
        geomRef.current = null;

        geometry.computeVertexNormals();
        geometry.center();

        geomRef.current = geometry;
        setGeom(geometry);
      },
      undefined,
      () => {
        // görüntüleme yüklemesi başarısızsa burada sessiz kalıyoruz
        // çünkü hata/validasyon worker tarafında zaten dönüyor
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!geom) return null;

  return (
    <group position={[0, yOffset, 0]}>
      <mesh geometry={geom} material={matRef.current!} castShadow receiveShadow />
    </group>
  );
}

export default function StlScene({ fileUrl, colorHex, onMetrics, onError }: Props) {
  const [targetY, setTargetY] = useState(60);
  const [yOffset, setYOffset] = useState(0);

  const workerRef = useRef<Worker | null>(null);

  // ✅ Worker'ı bir kez başlat
  useEffect(() => {
    workerRef.current = new Worker(new URL("./stlWorker.ts", import.meta.url), { type: "module" });
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  // ✅ Dosya değişince worker’dan metrik + bounds al
  useEffect(() => {
    if (!fileUrl) return;

    const w = workerRef.current;
    if (!w) return;

    let alive = true;

    const onMsg = (ev: MessageEvent<any>) => {
      if (!alive) return;
      const data = ev.data;

      if (data?.type === "err") {
        onError(data.code || "STL_UNREADABLE");
        return;
      }

      if (data?.type === "ok") {
        onMetrics(data.metrics);

        const h = data.bounds?.height ?? 120;
        const next = Math.max(35, Math.min(140, h * 0.45));
        setTargetY(next);

        setYOffset(data.bounds?.yOffset ?? 0);
      }
    };

    w.addEventListener("message", onMsg);
    w.postMessage({ type: "parse", url: fileUrl });

    return () => {
      alive = false;
      w.removeEventListener("message", onMsg);
    };
  }, [fileUrl, onMetrics, onError]);

  return (
    <Canvas
      // ✅ iOS için hafif ayarlar
      shadows={false}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: false, powerPreference: "low-power" }}
      camera={{ fov: 38, position: [-300, 350, 700] }}
      className="h-full w-full"
    >
      <color attach="background" args={["#f4f4f4"]} />

      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 12, 6]} intensity={1.1} />

      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.6, 0]}>
          <planeGeometry args={[BED_SIZE_MM, BED_SIZE_MM]} />
          <meshStandardMaterial color={"#e9e9e9"} roughness={0.95} metalness={0.0} />
        </mesh>

        <gridHelper args={[BED_SIZE_MM, GRID_DIV, "#bdbdbd", "#d6d6d6"]} position={[0, 0.05, 0]} />
      </group>

      <Suspense fallback={null}>
        {fileUrl && <StlMeshView url={fileUrl} colorHex={colorHex} yOffset={yOffset} />}
      </Suspense>

      <OrbitControls
        target={[0, targetY, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.3}
        minDistance={120}
        maxDistance={1400}
      />
    </Canvas>
  );
}
