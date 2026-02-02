"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
const GRID_DIV = 16;

// iOS WebKit daha hassas; erken limit
const IOS_MAX_VERTICES = 800_000;

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

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
  const geomRef = useRef<THREE.BufferGeometry | null>(null);
  const [yOffset, setYOffset] = useState(0);

  // ✅ Material'ı tek instance tut (iOS GPU memory leak engeli)
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Material'ı render'dan önce garanti oluştur (useEffect beklemeden)
  if (!matRef.current) {
    matRef.current = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.05,
    });
  }
  // Rengi güncelle
  matRef.current.color.set(colorHex);

  // ✅ URL değişince eski geometry’yi hemen temizle (RAM/GPU leak önler)
  useEffect(() => {
    return () => {
      if (geomRef.current) {
        geomRef.current.dispose();
        geomRef.current = null;
      }
      setGeom(null);
    };
  }, [url]);

  // ✅ Unmount'ta material dispose
  useEffect(() => {
    return () => {
      matRef.current?.dispose();
      matRef.current = null;
    };
  }, []);

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

        try {
          // ✅ Eski geometry varsa dispose et
          if (geomRef.current) {
            geomRef.current.dispose();
            geomRef.current = null;
          }

          // ✅ iOS için erken komplekslik kontrolü
          const pos = geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
          if (pos?.count && isIOS() && pos.count > IOS_MAX_VERTICES) {
            geometry.dispose();
            onError("TOO_COMPLEX");
            return;
          }

          geometry.computeVertexNormals();
          geometry.center();

          // ✅ metrikler: stlMetrics.ts artık iOS-safe (toNonIndexed yok)
          const m = computeMetricsFromGeometry(geometry);
          onMetrics(m);

          geometry.computeBoundingBox();
          const bb = geometry.boundingBox;

          if (bb) {
            const height = bb.max.y - bb.min.y;
            const centerY = (bb.max.y + bb.min.y) * 0.5;

            // Zemin üstüne oturt
            const offset = -bb.min.y;
            setYOffset(offset);

            onBounds({ height, centerY });
          } else {
            setYOffset(0);
            onBounds({ height: 120, centerY: 0 });
          }

          // ✅ state + ref
          geomRef.current = geometry;
          setGeom(geometry);
        } catch (e: any) {
          geometry.dispose();

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

  if (!geom) return null;

  return (
    <group position={[0, yOffset, 0]}>
      <mesh geometry={geom} material={matRef.current!} castShadow receiveShadow />
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

      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.6, 0]}>
          <planeGeometry args={[BED_SIZE_MM, BED_SIZE_MM]} />
          <meshStandardMaterial color={"#e9e9e9"} roughness={0.95} metalness={0.0} />
        </mesh>

        <gridHelper args={[BED_SIZE_MM, GRID_DIV, "#bdbdbd", "#d6d6d6"]} position={[0, 0.05, 0]} />
      </group>

      <Suspense fallback={null}>
        {fileUrl && (
          <StlMesh
            url={fileUrl}
            colorHex={colorHex}
            onMetrics={onMetrics}
            onError={onError}
            onBounds={({ height }) => {
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
