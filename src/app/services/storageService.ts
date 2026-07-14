import { supabase } from "../lib/supabase";

export const MEMBER_PHOTOS_BUCKET = "member-photos";
export const MEMBER_DOCUMENTS_BUCKET = "member-documents";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const DOCUMENT_MIME_TYPES = new Set([
  ...PHOTO_MIME_TYPES,
  "application/pdf",
]);

function getExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;

  if (file.type === "image/jpeg" || file.type === "image/jpg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "application/pdf") return "pdf";

  return "bin";
}

function validateFile(
  file: File,
  allowedTypes: Set<string>,
  maxSize: number,
  label: string
): string | null {
  if (!allowedTypes.has(file.type)) {
    return `${label}: formato não permitido. Use JPG, PNG, WEBP${
      allowedTypes.has("application/pdf") ? " ou PDF" : ""
    }.`;
  }

  if (file.size > maxSize) {
    const maxMb = Math.round(maxSize / (1024 * 1024));
    return `${label}: arquivo muito grande. Máximo ${maxMb}MB.`;
  }

  return null;
}

export async function uploadMemberPhoto(
  userId: string,
  file: File
): Promise<{ url?: string; error?: string }> {
  const validationError = validateFile(file, PHOTO_MIME_TYPES, MAX_PHOTO_SIZE, "Foto");
  if (validationError) return { error: validationError };

  const extension = getExtension(file);
  const path = `${userId}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEMBER_PHOTOS_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage
    .from(MEMBER_PHOTOS_BUCKET)
    .getPublicUrl(path);

  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  return { url: publicUrl };
}

export async function uploadMemberDocument(
  userId: string,
  file: File
): Promise<{ path?: string; error?: string }> {
  const validationError = validateFile(
    file,
    DOCUMENT_MIME_TYPES,
    MAX_DOCUMENT_SIZE,
    "Documento"
  );
  if (validationError) return { error: validationError };

  const extension = getExtension(file);
  const path = `${userId}/identity-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(MEMBER_DOCUMENTS_BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  return { path };
}

export async function getMemberDocumentSignedUrl(
  storagePath: string,
  expiresInSeconds = 300
): Promise<{ url?: string; error?: string }> {
  const { data, error } = await supabase.storage
    .from(MEMBER_DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) {
    return { error: error.message };
  }

  return { url: data.signedUrl };
}
