import { useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Button } from "./Button";
import { Popup } from "./Popup";

interface PhotoCropModalProps {
  imageSrc: string | null;
  onConfirm: (area: Area) => void | Promise<void>;
  onCancel: () => void;
  processing?: boolean;
}

/** Locked 1:1 crop step every photo must pass before entering the collage. */
export function PhotoCropModal({
  imageSrc,
  onConfirm,
  onCancel,
  processing = false,
}: PhotoCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);

  return (
    <Popup open={imageSrc !== null} onClose={onCancel}>
      <h3 className="font-script text-xl text-primary-dark">Sesuaikan Foto</h3>
      <p className="mt-1 text-xs text-text-soft">
        Geser &amp; zoom untuk mengatur bagian foto (rasio 1:1).
      </p>

      <div className="relative mt-3 aspect-square w-full overflow-hidden rounded-xl bg-text/10">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setAreaPixels(pixels)}
          />
        )}
      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.05}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--color-primary)]"
        aria-label="Zoom foto"
      />

      <div className="mt-4 flex gap-3">
        <Button
          variant="secondary"
          type="button"
          className="flex-1"
          onClick={onCancel}
          disabled={processing}
        >
          Batal
        </Button>
        <Button
          type="button"
          className="flex-1"
          loading={processing}
          onClick={() => {
            if (areaPixels) void onConfirm(areaPixels);
          }}
        >
          Gunakan Foto Ini
        </Button>
      </div>
    </Popup>
  );
}
