export function isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be|youtube-nocookie\.com/i.test(url);
}

export function toYoutubeEmbedUrl(url: string): string {
  if (url.includes("/embed/")) {
    return url.replace("youtube.com", "youtube-nocookie.com");
  }

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
  }

  return url;
}

export function extractYoutubeVideoId(url: string): string | null {
  const embedMatch = url.match(/\/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];

  return null;
}

export function isDirectVideoUrl(url: string): boolean {
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return true;
  return /\/storage\/v1\/object\/sign\//i.test(url);
}

export function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/i.test(url);
}

export function toVimeoEmbedUrl(url: string): string {
  if (url.includes("player.vimeo.com/video/")) return url;

  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }

  return url;
}

export function isLoomUrl(url: string): boolean {
  return /loom\.com/i.test(url);
}

export function toLoomEmbedUrl(url: string): string {
  if (url.includes("/embed/")) return url;
  const match = url.match(/loom\.com\/(?:share|embed)\/([a-z0-9]+)/i);
  if (match) {
    return `https://www.loom.com/embed/${match[1]}`;
  }
  return url;
}

export function normalizeTrainerVideoUrl(raw: string): { url?: string; error?: string } {
  const value = raw.trim();
  if (!value) return {};

  if (!/^https?:\/\//i.test(value)) {
    return { error: "Cole a URL completa, começando com https://" };
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { error: "Use um link https do seu vídeo." };
    }
  } catch {
    return { error: "URL inválida." };
  }

  return { url: value };
}

export function toPlaybackEmbedUrl(url: string): string {
  if (isYoutubeUrl(url)) return toYoutubeEmbedUrl(url);
  if (isVimeoUrl(url)) return toVimeoEmbedUrl(url);
  if (isLoomUrl(url)) return toLoomEmbedUrl(url);
  return url;
}

export function hasAssignedTrainerVideo(exercise: {
  videoRef?: string;
  videoUrl?: string;
}): boolean {
  return Boolean(exercise.videoRef?.trim() || exercise.videoUrl?.trim());
}

export function isHttpVideoUrl(value?: string): boolean {
  return Boolean(value && /^https?:\/\//i.test(value.trim()));
}
