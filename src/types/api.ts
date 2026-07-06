export type RsvpStatus = "attending" | "not_attending" | "unsure";

export interface Guest {
  guest_id: number;
  fullname: string;
  email: string | null;
  rsvp_status: RsvpStatus;
  qrcode_image: string | null;
  message: string;
}

export interface RsvpPayload {
  device_token: string;
  fullname: string;
  email: string | null;
  rsvp_status: RsvpStatus;
  message: string;
}

// POST /guests does not echo back `email` — it only reports whether it sent one.
export interface SubmitRsvpResult {
  guest_id: number;
  fullname: string;
  rsvp_status: RsvpStatus;
  qrcode_image: string | null;
  message: string;
  email_sent: boolean;
}

// GET /rsvp-messages items don't carry rsvp_status.
export interface RsvpMessage {
  guest_id: number;
  fullname: string;
  message: string;
  created_at: string;
}

export interface RsvpMessagesResponse {
  data: RsvpMessage[];
  has_more: boolean;
}

// POST /guestbook-images — one photo uploaded right after crop, in both
// versions (plain crop + framed composite), before the form is submitted.
export interface GuestbookImage {
  id: number;
  image_link: string;
  framed_image_link: string;
}

// POST /guestbook-messages (anonymous venue guestbook, multipart form).
// Photos are no longer sent as files here — they're pre-uploaded via
// /guestbook-images and referenced by id.
export interface GuestbookPayload {
  fullname: string;
  message?: string;
  voice?: Blob;
  imageIds: number[];
}

export interface GuestbookMessage {
  id: number;
  fullname: string;
  message: string | null;
  voice_link: string | null;
  images: string[];
}
