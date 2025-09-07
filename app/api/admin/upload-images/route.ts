import { corsHeaders } from "@/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import sharp from "sharp";
import { extractKeyFromUrl } from "@/lib/utils/features";

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isConvert = searchParams.get("isConvert") === "true";

    const utapi = new UTApi();
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const removeImageUrls = formData.getAll("removeImageUrls") as string[];

    if (!files.length && !removeImageUrls?.length) {
      return NextResponse.json("No files OR removeImageUrls provided", { status: 400, headers: corsHeaders });
    }


    let deleteRes: {
      success: boolean;
      deletedCount: number;
    } | null = null
    if (removeImageUrls.length > 0) {
      const keysToDelete = removeImageUrls.map(extractKeyFromUrl);
      try {
        const deleteResult = await utapi.deleteFiles(keysToDelete);
        deleteRes = deleteResult;
        console.log(keysToDelete);

        console.log("Delete result:", deleteResult);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }

    if (files) {
      const invalidFormatFiles = files.filter(
        (file) => file.type !== "image/webp" && file.type !== "image/avif"
      );

      if (isConvert && invalidFormatFiles.length > 0) {
        const webpFiles: File[] = [];
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const webpBuffer: any = await sharp(Buffer.from(arrayBuffer)).webp({ quality: 80 }).toBuffer();

          webpFiles.push(
            new File([webpBuffer], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" })
          );
        }

        const result = await utapi.uploadFiles(webpFiles);
        const uploaded = result.map((i) => i.data?.ufsUrl)
        const statusText = `Image Converted & uploaded ${deleteRes ? 'with ' + deleteRes?.deletedCount + ' images deleted' : ''} Successfully`
        return NextResponse.json({ uploaded, deleteRes: deleteRes || null }, { statusText, status: 200, headers: corsHeaders });
      }

      const result = await utapi.uploadFiles(files);
      const uploaded = result.map((i) => i.data?.ufsUrl)
      const statusText = `Image uploaded ${deleteRes ? 'and ' + deleteRes?.deletedCount + ' images Deleted' : ''} Successfully`
      return NextResponse.json({ uploaded, deleteRes: deleteRes || null }, { statusText, status: 200, headers: corsHeaders });
    }
    return NextResponse.json({ uploaded: null, deleteRes }, { statusText: deleteRes?.deletedCount + 'Images Deleted SuccesFully', status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Upload_Image error:", error);
    return NextResponse.json((error as Error).message, { status: 500, headers: corsHeaders });
  }
}
