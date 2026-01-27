"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { computeMetricsFromGeometry } from "./stlMetrics";

type Props = {
  fileUrl: string | null;
  colorHex: string;
  onMetrics: (m: { volumeMM3: number; saMM2: number; sahMM2: number }) => void;
  onError: (code: string) => void;
};

// Bambu Lab P1S bed size ~256x256 mm
const BED_SIZE_MM = 256;
const GRID_DIV = 16; // 16 => 16mm adım gibi düşünebilirsin (256/16=16)

function StlMesh({
  url,
  colorHex,
  onMetrics,
  onError,
  onBounds,
}: {
  url: string;
  colorHex: string;
  onMetrics: Props["onMetrics"];
  onError: Props["onError"];
  onBounds: (b: { height: number; centerY: number }) => void;
}) {
  const [geom, setGeom] = useState<THREE.BufferGeometry | null>(null);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        if (cancelled) return;

        try {
          geometry.computeVertexNormals();
          geometry.center();

          // metrikler
          const m = computeMetricsFromGeometry(geometry);
          onMetrics(m);

          // bounding box ile tablayı hizala + target ayarla
          geometry.computeBoundingBox();
          const bb = geometry.boundingBox;

          if (bb) {
            const height = bb.max.y - bb.min.y;
            const centerY = (bb.max.y + bb.min.y) * 0.5;

            // modelin altını y=0’a oturt
            const offset = -bb.min.y;
            setYOffset(offset);

            // OrbitControls target için bilgi
            onBounds({ height, centerY });
          } else {
            setYOffset(0);
            onBounds({ height: 120, centerY: 0 });
          }

          setGeom(geometry);
        } catch (e: any) {
          const msg = String(e?.message || e);
          if (msg.includes("TOO_COMPLEX")) onError("TOO_COMPLEX");
          else onError("STL_UNREADABLE");
        }
      },
      undefined,
      () => {
        if (cancelled) return;
        onError("UPLOAD_FAILED");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [url, onMetrics, onError, onBounds]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.35,
        metalness: 0.05,
      }),
    [colorHex]
  );

  if (!geom) return null;

  return (
    <group position={[0, yOffset, 0]}>
      <mesh geometry={geom} material={material} castShadow receiveShadow />
    </group>
  );
}

export default function StlScene({ fileUrl, colorHex, onMetrics, onError }: Props) {
  const [targetY, setTargetY] = useState(60);

  return (
    <Canvas shadows camera={{ fov: 38, position: [-300, 350, 700] }} className="h-full w-full">
      <color attach="background" args={["#f4f4f4"]} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* ✅ P1S tablayı görünür yap: gri plane + grid */}
      <group position={[0, 0, 0]}>
        {/* plane biraz aşağıda dursun (z-fighting olmasın) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.6, 0]}>
          <planeGeometry args={[BED_SIZE_MM, BED_SIZE_MM]} />
          <meshStandardMaterial color={"#e9e9e9"} roughness={0.95} metalness={0.0} />
        </mesh>

        {/* grid çizgileri */}
        <gridHelper
          args={[BED_SIZE_MM, GRID_DIV, "#bdbdbd", "#d6d6d6"]}
          position={[0, 0.05, 0]}
        />
      </group>

      <Suspense fallback={null}>
        {fileUrl && (
          <StlMesh
            url={fileUrl}
            colorHex={colorHex}
            onMetrics={onMetrics}
            onError={onError}
            onBounds={({ height }) => {
              // ✅ modeli preview içinde daha ortalı göstermek için targetY dinamik
              // height küçükse bile biraz yukarı hedefle
              const next = Math.max(35, Math.min(140, height * 0.45));
              setTargetY(next);
            }}
          />
        )}
      </Suspense>

      <OrbitControls
        target={[0, targetY, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.30}
        minDistance={120}
        maxDistance={1400}
      />
    </Canvas>
  );
}
