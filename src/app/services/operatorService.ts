import { supabase } from "../lib/supabase";
import type { OperatorProfile } from "../types/operator";

export async function loadOperatorProfile(
  userId: string
): Promise<OperatorProfile | null> {
  const { data, error } = await supabase
    .from("platform_operators")
    .select("user_id, full_name, active")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    userId: data.user_id,
    fullName: data.full_name,
    active: data.active,
  };
}
