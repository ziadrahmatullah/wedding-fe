import axios from "axios";
import type {
  Guest,
  GuestbookImage,
  GuestbookMessage,
  GuestbookPayload,
  RsvpPayload,
  RsvpMessagesResponse,
  SubmitRsvpResult,
} from "../types/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

interface ApiEnvelope<T> {
  data: T;
}

export async function fetchGuestByDevice(token: string): Promise<Guest | null> {
  try {
    const res = await api.get<ApiEnvelope<Guest>>(`/guests/by-device/${token}`);
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function submitRsvp(payload: RsvpPayload): Promise<SubmitRsvpResult> {
  const res = await api.post<ApiEnvelope<SubmitRsvpResult>>("/guests", payload);
  return res.data.data;
}

export interface QrcodeReadResult {
  fullname: string;
}

// Check-in scan at the registration desk. Short timeout so the operator UI
// never hangs on a bad connection; success/error messages come from the BE.
export async function readQrcode(qrcode: string): Promise<QrcodeReadResult> {
  const res = await api.post<{
    data?: { fullname?: string };
    fullname?: string;
  }>("/qrcode/read", { qrcode }, { timeout: 5000 });
  return { fullname: res.data.data?.fullname ?? res.data.fullname ?? "Tamu" };
}

// Uploads one photo (crop + framed composite) immediately after cropping,
// before the guestbook form is submitted — the returned id is referenced
// later in `image_ids`. The framed blob comes from html-to-image and is PNG.
export async function uploadGuestbookImage(
  normalBlob: Blob,
  framedBlob: Blob,
): Promise<GuestbookImage> {
  const form = new FormData();
  form.append("image", normalBlob, "photo.jpg");
  form.append("framed_image", framedBlob, "photo-framed.png");
  const res = await api.post<ApiEnvelope<GuestbookImage> | GuestbookImage>(
    "/guestbook-images",
    form,
  );
  const body = res.data;
  return "data" in body ? body.data : body;
}

// Anonymous venue guestbook. Still multipart because voice is a file, but
// photos are now sent as `image_ids` (JSON-encoded string) referencing
// already-uploaded /guestbook-images rows instead of repeated `images` files.
export async function submitGuestbookMessage(
  payload: GuestbookPayload,
  onProgress?: (percent: number) => void,
): Promise<GuestbookMessage> {
  const form = new FormData();
  form.append("fullname", payload.fullname);
  if (payload.message) form.append("message", payload.message);
  if (payload.voice) form.append("voice", payload.voice, "voice.webm");
  form.append("image_ids", JSON.stringify(payload.imageIds));

  const res = await api.post<ApiEnvelope<GuestbookMessage>>(
    "/guestbook-messages",
    form,
    {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    },
  );
  return res.data.data;
}

export async function fetchGuestbookMessageById(id: string): Promise<GuestbookMessage> {
  const res = await api.get<ApiEnvelope<GuestbookMessage>>(`/guestbook-messages/${id}`);
  return res.data.data;
}

export async function fetchRsvpMessages(params: {
  limit: number;
  before?: string;
}): Promise<RsvpMessagesResponse> {
  const res = await api.get<RsvpMessagesResponse>("/rsvp-messages", {
    params: {
      limit: params.limit,
      before: params.before,
    },
  });
  return res.data;
}
