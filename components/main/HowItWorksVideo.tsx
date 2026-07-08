import { mediaUrl } from "@/lib/strapi";

type Props = {
  title: string;
  description?: string | null;
  video?: any | null;
  posterImage?: any | null;
};

export default function HowItWorksVideo({ title, description, video, posterImage }: Props) {
  const videoUrl = mediaUrl(video?.url);
  const posterUrl = mediaUrl(posterImage?.url);

  if (!videoUrl) return null;

  return (
    <section className="relative z-10 py-20 md:py-32 bg-[#0b1120]">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 mx-auto max-w-4xl">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl">
            <video
              className="w-full h-auto"
              controls
              preload="metadata"
              poster={posterUrl || undefined}
            >
              <source src={videoUrl} type={video?.mime || "video/mp4"} />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
