"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { removeBackground } from "@imgly/background-removal";

/* ---------- helpers ---------- */

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

async function cropTransparentPNG(
  pngBlob: Blob,
  threshold = 8,
  paddingPx = 12
): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await blobToImage(pngBlob);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("No 2D context");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;

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

  if (maxX < 0 || maxY < 0) {
    return { blob: pngBlob, width: img.width, height: img.height };
  }

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

// performans: büyük görselleri küçült
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
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("downscale toBlob failed"))),
      "image/png",
      0.92
    );
  });
}

/* ---------- 3D object (coaster + front-facing logo) ---------- */

function CoasterWithFrontLogo({ textureUrl, aspect }: { textureUrl: string; aspect: number }) {
  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [textureUrl]);

  // Bardak altlığı ölçüleri
  const coasterRadius = 1.18;
  const coasterThickness = 0.18;

  // Logo'nun maksimum alanı (ekrana bakan plane)
  const maxW = coasterRadius * 2 * 0.82;
  const maxH = 0.90;

  let w = maxW;
  let h = w / Math.max(0.01, aspect);
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }

  // Plaka üst yüzeyi (Y)
  const topY = coasterThickness / 2;

  // Logo: plakanın üstünden çıkıp ekrana baksın
  const logoY = topY + 0.55;
  const logoZ = coasterRadius * 0.05; // çok az öne

  return (
    <group>
      {/* Dairesel plaka */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[coasterRadius, coasterRadius, coasterThickness, 96]} />
        <meshPhysicalMaterial
          color="#f4f4f5"
          roughness={0.35}
          metalness={0}
          clearcoat={0.55}
          clearcoatRoughness={0.25}
          specularIntensity={0.6}
        />
      </mesh>

      {/* Üst yüzeyde hafif “inner bevel” hissi */}
      <mesh receiveShadow position={[0, topY - 0.01, 0]}>
        <torusGeometry args={[coasterRadius * 0.78, 0.028, 16, 96]} />
        <meshStandardMaterial color="#ececee" roughness={0.55} metalness={0} />
      </mesh>

      {/* Logo (dikey, kameraya tam bakıyor) */}
      <mesh position={[0, logoY, logoZ]} castShadow receiveShadow>
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

/* ---------- main ---------- */

export default function Logo3DPreview({ file }: { file?: File | null }) {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number>(2);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let revoke: string | null = null;
    let timer: number | undefined;

    async function run() {
      if (!file) {
        setProcessedUrl(null);
        setProgress(0);
        return;
      }

      if (file.type === "application/pdf") {
        setProcessedUrl(null);
        setProgress(0);
        return;
      }

      setBusy(true);
      setProgress(0);

      // UX progress (yumuşak akar)
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
      <div className="h-[260px] w-full rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-500">
        Logo yüklendiğinde burada gözükecek
      </div>
    );
  }

  return (
    <div className="relative h-[260px] w-full rounded-2xl bg-neutral-50 overflow-hidden">
      {busy && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
            <div className="text-sm font-medium text-neutral-700">Logo hazırlanıyor…</div>
          </div>

          <div className="w-[70%]">
            <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-neutral-900 transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-neutral-600 text-center">%{progress} tamamlandı</div>
          </div>
        </div>
      )}

      {processedUrl ? (
        <Canvas
          camera={{ position: [0, 0.95, 3.0], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          <ambientLight intensity={0.95} />
          <directionalLight position={[3, 4, 3]} intensity={1.15} castShadow />
          <CoasterWithFrontLogo textureUrl={processedUrl} aspect={aspect} />
          <Environment preset="city" />
          <OrbitControls enabled={false} />
        </Canvas>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-neutral-500">
          {file.type === "application/pdf" ? "PDF önizleme şimdilik kapalı" : "Önizleme hazırlanıyor"}
        </div>
      )}
    </div>
  );
}
