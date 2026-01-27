"use client";

type Props = {
  title?: string;
  videoUrl: string | null;
};

export default function HowItWorksVideo({ title, videoUrl }: Props) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-3 text-base font-semibold text-neutral-900">
        {title ?? "Teklif Almayı Nasıl Kullanırsınız?"}
      </h3>

      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
        {videoUrl ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-neutral-600">
            Strapi’de “howItWorksVideo” yüklenmemiş veya erişilemiyor.
          </div>
        )}
      </div>
    </div>
  );
}
