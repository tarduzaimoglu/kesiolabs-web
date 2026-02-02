"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

  // tamamen boşsa kırpma yapma
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

/* ---------- 3D object ---------- */

function RotatingLogo({ textureUrl, aspect }: { textureUrl: string; aspect: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace; // ✅ renkleri koru
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.35; // ✅ yavaş dönüş
  });

  const h = 1.05;
  const w = Math.max(1.2, h * aspect); // aşırı dar olmasın

  return (
    <group ref={groupRef}>
      {/* Plastik gövde */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w * 1.06, h * 1.06, 0.10]} />
        <meshPhysicalMaterial
          color="#f3f3f3"
          roughness={0.35}
          metalness={0}
          clearcoat={0.65} // ✅ plastik vernik hissi
          clearcoatRoughness={0.25}
          specularIntensity={0.6}
        />
      </mesh>

      {/* Logo yüzeyi (orijinal renkler) */}
      <mesh position={[0, 0, 0.055]} castShadow receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          map={texture}
          transparent
          alphaTest={0.02} // ✅ kenar halelerini azaltır
          roughness={0.25}
          metalness={0}
          clearcoat={0.35}
          clearcoatRoughness={0.22}
          toneMapped={false} // ✅ logo renkleri solmasın
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

  useEffect(() => {
    let revoke: string | null = null;

    async function run() {
      if (!file) {
        setProcessedUrl(null);
        return;
      }

      // PDF için ayrı pipeline gerekir (istersen ekleriz)
      if (file.type === "application/pdf") {
        setProcessedUrl(null);
        return;
      }

      setBusy(true);
      try {
        const inputUrl = URL.createObjectURL(file);

        // ✅ arka plan kaldır
        const removedBlob = await removeBackground(inputUrl);
        URL.revokeObjectURL(inputUrl);

        // ✅ otomatik kırp (tight crop)
        const cropped = await cropTransparentPNG(removedBlob, 8, 12);

        revoke = URL.createObjectURL(cropped.blob);
        setAspect(cropped.width / cropped.height);
        setProcessedUrl(revoke);
      } catch (e) {
        console.error(e);
        setProcessedUrl(null);
      } finally {
        setBusy(false);
      }
    }

    run();

    return () => {
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
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm text-neutral-700">
          Logo hazırlanıyor…
        </div>
      )}

      {processedUrl ? (
        <Canvas
          camera={{ position: [0, 0, 3.15], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 3, 3]} intensity={1.2} />
          <RotatingLogo textureUrl={processedUrl} aspect={aspect} />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-neutral-500">
          Önizleme oluşturulamadı
        </div>
      )}
    </div>
  );
}
