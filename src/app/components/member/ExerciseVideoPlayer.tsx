import { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { isDirectVideoUrl, isYoutubeUrl, toYoutubeEmbedUrl } from "../../utils/video";

interface ExerciseVideoPlayerProps {
  url?: string;
  title: string;
  defaultExpanded?: boolean;
  compact?: boolean;
}

export function ExerciseVideoPlayer({
  url,
  title,
  defaultExpanded = false,
  compact = false,
}: ExerciseVideoPlayerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!url) return null;

  const isYoutube = isYoutubeUrl(url);
  const isDirect = isDirectVideoUrl(url);
  const embedUrl = isYoutube ? toYoutubeEmbedUrl(url) : url;

  if (compact && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-xs font-semibold uppercase mt-2"
      >
        <Play size={14} />
        Ver movimento
      </button>
    );
  }

  return (
    <div className={compact ? "mt-3" : "mb-3"}>
      {compact && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 text-xs mb-2"
        >
          <ChevronUp size={14} />
          Ocultar vídeo
        </button>
      )}

      {!compact && (
        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
          <Play size={12} className="text-yellow-400" />
          Demonstração do movimento
        </p>
      )}

      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-neutral-950 border border-neutral-700">
        {isYoutube ? (
          <iframe
            src={`${embedUrl}?rel=0&modestbranding=1`}
            title={`Vídeo: ${title}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : isDirect ? (
          <video
            src={embedUrl}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            title={`Vídeo: ${title}`}
          >
            <track kind="captions" />
          </video>
        ) : (
          <iframe
            src={embedUrl}
            title={`Vídeo: ${title}`}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>

      {compact && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 text-xs mt-2"
        >
          <ChevronDown size={14} />
          Recolher
        </button>
      )}
    </div>
  );
}
