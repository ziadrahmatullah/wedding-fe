import { toBlob } from "html-to-image";

/**
 * Captures a rendered frame DOM node as a PNG blob — a literal screenshot of
 * what's on screen, not a manually redrawn approximation. This guarantees
 * the download/share output matches the preview pixel-for-pixel (same font
 * rendering, same ornament positions), which a separate Canvas-drawing path
 * could never promise.
 */
export async function captureFrame(node: HTMLElement): Promise<Blob> {
  // Avoid capturing a fallback font before the calligraphy webfont finishes loading.
  await document.fonts.ready;

  const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });
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
