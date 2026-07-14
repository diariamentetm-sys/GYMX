/** Vídeos demonstrativos padrão por nome de exercício (fallback quando video_url não está no banco). */
export const EXERCISE_VIDEO_LIBRARY: Record<string, string> = {
  "Supino reto": "https://www.youtube.com/embed/rT7DgCr-3pg",
  "Supino inclinado com halteres": "https://www.youtube.com/embed/8iPEnn-ltC8",
  "Crucifixo na polia": "https://www.youtube.com/embed/taI4XDuL0Xw",
  "Tríceps pulley": "https://www.youtube.com/embed/2-LAMcpzODU",
  "Tríceps testa": "https://www.youtube.com/embed/d_KZxkY_0cM",
  "Puxada frontal": "https://www.youtube.com/embed/CAwf7n6Luuc",
  "Remada curvada": "https://www.youtube.com/embed/9efgcAjQeAE",
  "Remada unilateral": "https://www.youtube.com/embed/pYcpY20QaE8",
  "Rosca direta": "https://www.youtube.com/embed/ykJmrZ5v0Oo",
  "Rosca martelo": "https://www.youtube.com/embed/zC3nLlEvin4",
  "Agachamento livre": "https://www.youtube.com/embed/ultWZbUMPL8",
  "Leg press 45°": "https://www.youtube.com/embed/IZxyjW7MPJQ",
  "Cadeira extensora": "https://www.youtube.com/embed/YyvSfVjQeL0",
  "Desenvolvimento com halteres": "https://www.youtube.com/embed/qEwKCR5JCog",
  "Elevação lateral": "https://www.youtube.com/embed/3VcKaXpzqRo",
  Burpee: "https://www.youtube.com/embed/TU8QYVW0gDU",
  "Kettlebell swing": "https://www.youtube.com/embed/YSxHifyIjo0",
  Prancha: "https://www.youtube.com/embed/ASdvN_XEl_c",
  "Mountain climber": "https://www.youtube.com/embed/nmwgirgXLYM",
};

export function resolveExerciseVideoUrl(
  exerciseName: string,
  storedUrl?: string
): string | undefined {
  if (storedUrl?.trim()) return storedUrl.trim();
  return EXERCISE_VIDEO_LIBRARY[exerciseName];
}
