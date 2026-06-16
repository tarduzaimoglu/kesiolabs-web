"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { removeBackground } from "@imgly/background-removal";
import { Loader2 } from "lucide-react";

/* ---------- helpers (Aynı Kaldı) ---------- */
async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("Image load failed"));
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function cropTransparentPNG(pngBlob: Blob, threshold = 8, paddingPx = 12): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await blobToImage(pngBlob);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No 2D context");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > threshold) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0 || maxY < 0) return { blob: pngBlob, width: img.width, height: img.height };
  minX = Math.max(0, minX - paddingPx);
  minY = Math.max(0, minY - paddingPx);
  maxX = Math.min(width - 1, maxX + paddingPx);
  maxY = Math.min(height - 1, maxY + paddingPx);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = cropW;
  out.height = cropH;
  const outCtx = out.getContext("2d");
  if (!outCtx) throw new Error("No out 2D context");
  outCtx.clearRect(0, 0, cropW, cropH);
  outCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  const outBlob: Blob = await new Promise((resolve, reject) => {
    out.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
  });
  return { blob: outBlob, width: cropW, height: cropH };
}

async function downscaleImage(file: File, maxSize = 1024): Promise<Blob> {
  const img = await blobToImage(file);
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  if (scale === 1) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context for downscale");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("downscale toBlob failed"))), "image/png", 0.92);
  });
}

/* ---------- scene (Malzeme Rengi Temaya Uygun Karartıldı) ---------- */
function SetInitialCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.9, 3.0);
    camera.lookAt(0, 0.45, 0);
  }, [camera]);
  return null;
}

function CoasterScene({ textureUrl, aspect }: { textureUrl: string; aspect: number }) {
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [textureUrl]);

  const coasterRadius = 1.18;
  const coasterThickness = 0.14;
  const maxW = coasterRadius * 2 * 0.82;
  const maxH = coasterRadius * 2 * 0.35;
  let w = maxW;
  let h = w / Math.max(0.01, aspect);
  if (h > maxH) { h = maxH; w = h * aspect; }
  const topY = coasterThickness / 2;
  const logoY = topY + 0.002;

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[coasterRadius, coasterRadius, coasterThickness, 96]} />
        <meshPhysicalMaterial
          color="#1e293b" // Açık griden koyu Slate rengine geçiş
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>
      <mesh position={[0, logoY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          roughness={0.25}
          metalness={0}
          clearcoat={0.25}
          clearcoatRoughness={0.28}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ---------- main (UI Güncellendi) ---------- */
export default function Logo3DPreview({ file }: { file?: File | null }) {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number>(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let revoke: string | null = null;
    let timer: number | undefined;

    async function run() {
      if (!file) { setProcessedUrl(null); setProgress(0); return; }
      if (file.type === "application/pdf") { setProcessedUrl(null); setProgress(0); return; }
      setBusy(true); setProgress(0);

      let p = 0;
      timer = window.setInterval(() => {
        p = Math.min(92, p + Math.random() * 7);
        setProgress(Math.floor(p));
      }, 250);

      try {
        const resized = await downscaleImage(file, 1024);
        const inputUrl = URL.createObjectURL(resized);
        const removedBlob = await removeBackground(inputUrl);
        URL.revokeObjectURL(inputUrl);
        const cropped = await cropTransparentPNG(removedBlob, 8, 12);
        revoke = URL.createObjectURL(cropped.blob);
        setAspect(cropped.width / cropped.height);
        setProcessedUrl(revoke);
        setProgress(100);
      } catch (e) {
        console.error(e);
        setProcessedUrl(null);
      } finally {
        if (timer) window.clearInterval(timer);
        setBusy(false);
        setTimeout(() => setProgress(0), 400);
      }
    }
    run();
    return () => {
      if (timer) window.clearInterval(timer);
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [file]);

  if (!file) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500">
        <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center mb-4 opacity-50">
          <span className="text-2xl font-light">3D</span>
        </div>
        Logo yüklendiğinde burada gözükecek
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {busy && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0b1120]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            <div className="text-sm font-medium text-slate-300">Logo Yapay Zeka ile İşleniyor…</div>
          </div>
          <div className="w-[70%] max-w-[200px]">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-[width] duration-200 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {processedUrl ? (
        <Canvas
          shadows
          camera={{ position: [0, 0.9, 3.0], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          <SetInitialCamera />
          <ambientLight intensity={0.5} />
          {/* Karanlık temaya uygun dramatik ışıklar */}
          <directionalLight position={[3, 4, 3]} intensity={2} castShadow color="#ffffff" />
          <directionalLight position={[-3, 2, -3]} intensity={1} color="#6366f1" />
          <CoasterScene textureUrl={processedUrl} aspect={aspect} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} dampingFactor={0.12} enableDamping />
        </Canvas>
      ) : (
        !busy && (
          <div className="h-full w-full flex items-center justify-center text-slate-500 text-center px-4">
            {file.type === "application/pdf" ? "PDF önizleme şimdilik kapalı, ancak logolarınızı işleme alabiliyoruz." : "Önizleme hazırlanıyor"}
          </div>
        )
      )}
    </div>
  );
}
