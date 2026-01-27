import { getMediaUrl } from "@/lib/strapi-main";

type Props = {
  title: string;
  description?: string | null;
  video?: any | null;
  posterImage?: any | null;
};

export default function HowItWorksVideo({ title, description, video, posterImage }: Props) {
  const videoUrl = getMediaUrl(video?.url);
  const posterUrl = getMediaUrl(posterImage?.url);

  if (!videoUrl) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm md:text-base text-slate-600">{description}</p>
          ) : null}
        </div>

        <div className="mt-8 mx-auto max-w-4xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
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
