export interface CroppedPhoto {
  id: string;
  blob: Blob;
  dataUrl: string;
}

// No downscale/compression pass anymore — guests' photos upload at the crop
// area's native resolution so the stored file keeps the original detail.
// 4096 is not a quality knob: older iOS Safari silently fails on canvases
// larger than 4096x4096, so it's a hard ceiling for the crop canvas.
const MAX_CANVAS_DIMENSION = 4096;
// 0.95 is visually lossless; the canvas has to re-encode after cropping, so
// "no compression" in the literal sense (PNG) would triple the upload size
// with zero visible gain on a photo.
const JPEG_QUALITY = 0.95;

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
 * Crop the source image to the given pixel area (from react-easy-crop) at
 * native resolution — no downscaling, high-quality JPEG re-encode only.
 */
export async function cropPhoto(
  imageSrc: string,
  area: { x: number; y: number; width: number; height: number },
): Promise<CroppedPhoto> {
  const img = await loadImage(imageSrc);
  const size = Math.min(Math.round(area.width), MAX_CANVAS_DIMENSION);

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
