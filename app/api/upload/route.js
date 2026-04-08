export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOC_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOCS = ["application/pdf", "image/jpeg", "image/png"];

/*
  POST /api/upload
  FormData: { file, type: 'image' | 'document' }
  Returns:  { success, url }

  To migrate to AWS R2 later:
  - Replace writeFile block with R2 PutObject
  - Return R2 public URL
  - Frontend/DB code stays unchanged — only this file changes
*/
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "image";

    if (!file || typeof file === "string")
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );

    const allowed = type === "document" ? ALLOWED_DOCS : ALLOWED_IMAGES;
    const maxSize = type === "document" ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;

    if (!allowed.includes(file.type))
      return NextResponse.json(
        { success: false, message: `Invalid file type: ${file.type}` },
        { status: 400 },
      );

    if (file.size > maxSize)
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Max ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 },
      );

    const ext = file.name.split(".").pop().toLowerCase();
    const filename = `${randomUUID()}.${ext}`;
    const folder = type === "document" ? "documents" : "images";
    const dir = join(process.cwd(), "public", "uploads", folder);
    const filepath = join(dir, filename);

    // Ensure folder exists
    await import("fs/promises").then((fs) =>
      fs.mkdir(dir, { recursive: true }),
    );

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // URL served from Next.js public folder
    // When switching to R2: return r2Client.upload() URL here instead
    const url = `/uploads/${folder}/${filename}`;

    return NextResponse.json({ success: true, url, filename });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
