import { toBlob } from "html-to-image";

/**
 * Captures a rendered frame DOM node as a PNG blob — a literal screenshot of
 * what's on screen, not a manually redrawn approximation. This guarantees
 * the download/share output matches the preview pixel-for-pixel (same font
 * rendering, same ornament positions), which a separate Canvas-drawing path
 * could never promise.
 */
export async function captureFrame(node: HTMLElement, pixelRatio = 3): Promise<Blob> {
  // Avoid capturing a fallback font before the calligraphy webfont finishes loading.
  await document.fonts.ready;

  // pixelRatio 2 looked soft once viewed at full size or shared to a bigger
  // screen — the capture is only as sharp as the CSS-rendered node (~350-
  // 400px wide on a phone), so it needs real upscaling headroom. 3x is the
  // default for on-screen nodes; the off-screen upload capture passes a
  // higher ratio since that file is stored permanently on the server.
  const blob = await toBlob(node, { pixelRatio, quality: 1, cacheBust: true });
  if (!blob) throw new Error("capture-failed");
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
