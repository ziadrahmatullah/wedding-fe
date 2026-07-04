export interface CroppedPhoto {
  id: string;
  blob: Blob;
  dataUrl: string;
}

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.8;

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image-load-failed"));
    img.src = src;
  });
}

/**
 * Crop the source image to the given pixel area (from react-easy-crop),
 * downscale to at most 1200px, and compress to JPEG — keeps mobile uploads
 * small before anything is stored in state.
 */
export async function cropAndCompress(
  imageSrc: string,
  area: { x: number; y: number; width: number; height: number },
): Promise<CroppedPhoto> {
  const img = await loadImage(imageSrc);
  const size = Math.min(Math.round(area.width), MAX_DIMENSION);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unsupported");

  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode-failed"))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  return {
    id: crypto.randomUUID(),
    blob,
    dataUrl: canvas.toDataURL("image/jpeg", JPEG_QUALITY),
  };
}
