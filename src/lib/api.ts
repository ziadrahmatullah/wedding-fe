import axios from "axios";
import type {
  Guest,
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

// Anonymous venue guestbook. Multipart keys verified against the live BE:
// `fullname`, `message`, `voice` (single file), `images` (repeated key).
export async function submitGuestbookMessage(
  payload: GuestbookPayload,
  onProgress?: (percent: number) => void,
): Promise<GuestbookMessage> {
  const form = new FormData();
  form.append("fullname", payload.fullname);
  if (payload.message) form.append("message", payload.message);
  if (payload.voice) form.append("voice", payload.voice, "voice.webm");
  payload.images.forEach((img, i) => form.append("images", img, `photo-${i + 1}.jpg`));

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
