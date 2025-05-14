import { corsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import sharp from "sharp";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
function extractKeyFromUrl(url: string): string {
  const key = url.split("/").pop();
  return key!;
}
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isConvert = searchParams.get("isConvert") === "true";

    const utapi = new UTApi();
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json("No files uploaded", { status: 400, headers: corsHeaders });
    }

    const removeImageUrls = formData.getAll("removeImageUrls") as string[];

    if (removeImageUrls.length > 0) {
      console.log("Parsed removeImageUrls:", removeImageUrls);
      const keysToDelete = removeImageUrls.map(extractKeyFromUrl);
      console.log("Keys to delete:", keysToDelete);
      try {
        const deleteResult = await utapi.deleteFiles(keysToDelete);
        console.log("Delete result:", deleteResult);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }

    const invalidFormatFiles = files.filter(
      (file) => file.type !== "image/webp" && file.type !== "image/avif"
    );

    if (isConvert && invalidFormatFiles.length > 0) {
      const webpFiles: File[] = [];
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const webpBuffer = await sharp(Buffer.from(arrayBuffer)).webp({ quality: 80 }).toBuffer();

        webpFiles.push(
          new File([webpBuffer], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" })
        );
      }

      const result = await utapi.uploadFiles(webpFiles);
      const uploaded = result.map((i) => i.data?.ufsUrl)
      return NextResponse.json(uploaded, { status: 200, headers: corsHeaders });
    }

    const result = await utapi.uploadFiles(files);
    const uploaded = result.map((i) => i.data?.ufsUrl)
    return NextResponse.json(uploaded, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Upload_Image error:", error);
    return NextResponse.json((error as Error).message, { status: 500, headers: corsHeaders });
  }
}
