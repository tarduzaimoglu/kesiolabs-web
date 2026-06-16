"use client";

import { PlayCircle } from "lucide-react";

type Props = {
  title?: string;
  videoUrl: string | null;
};

export default function HowItWorksVideo({ title, videoUrl }: Props) {
  return (
    <div className="rounded-3xl bg-white/[0.02] p-6 border border-white/10 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-3 mb-4">
        <PlayCircle className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">
          {title ?? "Teklif Almayı Nasıl Kullanırsınız?"}
        </h3>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5">
        {videoUrl ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-500">
            Tanıtım videosu şu an için kullanılamıyor.
          </div>
        )}
      </div>
    </div>
  );
}
