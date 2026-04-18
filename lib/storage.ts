import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function encodePathSegments(filePath: string) {
  return filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getSupabaseStorageConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    return null;
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/+$/, ""),
    serviceRoleKey,
    bucket,
  };
}

async function uploadFilesToSupabase(files: File[], userId: string, scope: string) {
  const config = getSupabaseStorageConfig();

  if (!config) {
    return null;
  }

  const uploadedFiles: string[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`حجم الملف ${file.name} يتجاوز الحد المسموح 20MB.`);
    }

    const safeName = sanitizeFileName(file.name) || "attachment";
    const finalName = `${Date.now()}-${randomUUID()}-${safeName}`;
    const objectPath = `${scope}/${userId}/${finalName}`;
    const uploadUrl = `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${encodePathSegments(objectPath)}`;
    const body = Buffer.from(await file.arrayBuffer());

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body,
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`تعذر رفع الملف إلى Supabase Storage. ${payload}`);
    }

    uploadedFiles.push(
      `${config.supabaseUrl}/storage/v1/object/public/${config.bucket}/${encodePathSegments(objectPath)}`,
    );
  }

  return uploadedFiles;
}

async function uploadFilesLocally(files: File[], userId: string, scope: string) {
  const uploadDirectory = path.join(process.cwd(), "public", "uploads", scope, userId);
  await mkdir(uploadDirectory, { recursive: true });

  return Promise.all(
    files.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`حجم الملف ${file.name} يتجاوز الحد المسموح 20MB.`);
      }

      const safeName = sanitizeFileName(file.name) || "attachment";
      const finalName = `${Date.now()}-${randomUUID()}-${safeName}`;
      const finalPath = path.join(uploadDirectory, finalName);
      const bytes = Buffer.from(await file.arrayBuffer());

      await writeFile(finalPath, bytes);

      return `/uploads/${scope}/${userId}/${encodeURIComponent(finalName)}`;
    }),
  );
}

export async function uploadFiles(files: File[], userId: string, scope: string) {
  const supabaseResult = await uploadFilesToSupabase(files, userId, scope);

  if (supabaseResult) {
    return { provider: "supabase" as const, files: supabaseResult };
  }

  const localResult = await uploadFilesLocally(files, userId, scope);
  return { provider: "local" as const, files: localResult };
}
