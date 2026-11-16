export interface PublicPersonalProfile {
  staffId: string;
  slug: string;
  fullName: string;
  headline: string;
  bio: string;
  photoUrl?: string;
  cref: string;
  specialties: string[];
  studentMonthlyPrice: number;
  listed: boolean;
}

export function personalPublicPath(slug: string) {
  return `/p/${encodeURIComponent(slug)}`;
}
