// app/api/download-all/route.ts
//
// This runs on the server, so fetching Cloudinary images here is NOT subject
// to browser CORS restrictions — CORS is a browser-only security feature.
// The client just hits this endpoint and gets a ready-made zip back.

import JSZip from "jszip";

const IMAGES = [
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228443/IMG_8045_hzyzsc",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228437/IMG_8047_uav0vv",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228450/IMG_8041_ueaxkk",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228438/IMG_8030_iqbj5t",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228437/IMG_8028_dh4iqr",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228439/IMG_8064_iyqyn2",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228438/IMG_8026_sgnunr",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228440/IMG_8033_nsdn5b",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228440/IMG_8050_ekqlng",
  "https://res.cloudinary.com/dx3k7hbnc/image/upload/f_auto,q_auto/v1789228440/IMG_8054_bvbtwe",
];

export async function GET() {
  try {
    const zip = new JSZip();
    const folder = zip.folder("DAVE_gallery")!;

    await Promise.all(
      IMAGES.map(async (src, i) => {
        const res = await fetch(src);
        if (!res.ok) {
          throw new Error(`Failed to fetch image ${i + 1}: ${res.status}`);
        }
        const arrayBuffer = await res.arrayBuffer();
        folder.file(`DAVE_${i + 1}.jpg`, arrayBuffer);
      })
    );

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBytes = new Uint8Array(zipBuffer);

    return new Response(zipBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="DAVE_gallery.zip"',
      },
    });
  } catch (err) {
    console.error("download-all zip failed:", err);
    return new Response(JSON.stringify({ error: "Failed to build zip" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
