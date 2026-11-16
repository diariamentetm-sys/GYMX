import { supabase } from "../lib/supabase";
import type { PublicPersonalProfile } from "../types/personal";

interface PublicPersonalRow {
  staff_id: string;
  slug: string;
  headline: string;
  bio: string;
  photo_url: string | null;
  cref: string;
  specialties: string[] | null;
  student_monthly_price: number | string;
  listed: boolean;
}

function mapProfile(row: PublicPersonalRow, fullName?: string): PublicPersonalProfile {
  return {
    staffId: row.staff_id,
    slug: row.slug,
    fullName: fullName?.trim() || row.headline || "Personal",
    headline: row.headline,
    bio: row.bio,
    photoUrl: row.photo_url ?? undefined,
    cref: row.cref,
    specialties: row.specialties ?? [],
    studentMonthlyPrice: Number(row.student_monthly_price),
    listed: row.listed,
  };
}

const PUBLIC_COLUMNS =
  "staff_id, slug, headline, bio, photo_url, cref, specialties, student_monthly_price, listed";

export async function fetchListedPersonals(): Promise<PublicPersonalProfile[]> {
  const { data, error } = await supabase
    .from("personal_public_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("listed", true)
    .order("headline", { ascending: true });

  if (error || !data) return [];
  return (data as PublicPersonalRow[]).map((row) => mapProfile(row));
}

export async function fetchPersonalByStaffId(
  staffId: string
): Promise<PublicPersonalProfile | null> {
  const { data, error } = await supabase
    .from("personal_public_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("staff_id", staffId)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfile(data as PublicPersonalRow);
}

export async function fetchPersonalBySlug(
  slug: string
): Promise<PublicPersonalProfile | null> {
  const { data, error } = await supabase
    .from("personal_public_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfile(data as PublicPersonalRow);
}

export async function fetchOwnPublicProfile(): Promise<{
  profile: PublicPersonalProfile | null;
  error?: string;
}> {
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData.user?.id;
  if (!userId) return { profile: null, error: "Não autenticado." };

  const { data, error } = await supabase
    .from("personal_public_profiles")
    .select(PUBLIC_COLUMNS)
    .eq("staff_id", userId)
    .maybeSingle();

  if (error) {
    return { profile: null, error: "Não foi possível carregar a página pública." };
  }
  if (!data) return { profile: null };

  const { data: staff } = await supabase
    .from("staff_profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  return {
    profile: mapProfile(data as PublicPersonalRow, staff?.full_name),
  };
}

export async function updateOwnPublicProfile(input: {
  slug: string;
  headline: string;
  bio: string;
  cref: string;
  specialties: string[];
  studentMonthlyPrice: number;
  listed: boolean;
}): Promise<{ error?: string }> {
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData.user?.id;
  if (!userId) return { error: "Não autenticado." };

  const { error } = await supabase
    .from("personal_public_profiles")
    .update({
      slug: input.slug,
      headline: input.headline,
      bio: input.bio,
      cref: input.cref,
      specialties: input.specialties,
      student_monthly_price: input.studentMonthlyPrice,
      listed: input.listed,
    })
    .eq("staff_id", userId);

  if (error) {
    if (error.code === "23505") return { error: "Este endereço de URL já está em uso." };
    if (error.code === "23514") {
      return { error: "Use um slug com letras minúsculas, números e hífen (3 a 60 caracteres)." };
    }
    return { error: error.message || "Não foi possível salvar a página pública." };
  }
  return {};
}

export async function contractPersonalService(
  staffId: string
): Promise<{ error?: string }> {
  const { data, error } = await supabase.rpc("contract_personal_service", {
    p_staff_id: staffId,
  });

  if (error) {
    return { error: error.message || "Não foi possível contratar este personal." };
  }

  const payload = data as { success?: boolean; error?: string } | null;
  if (payload && payload.success === false) {
    return { error: payload.error ?? "Não foi possível contratar este personal." };
  }
  return {};
}
