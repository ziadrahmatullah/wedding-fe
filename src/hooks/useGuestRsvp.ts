import { useCallback, useEffect, useState } from "react";
import { fetchGuestByDevice, submitRsvp } from "../lib/api";
import { getDeviceToken } from "../lib/deviceToken";
import type { Guest, RsvpPayload } from "../types/api";

export function useGuestRsvp() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getDeviceToken();
        const found = await fetchGuestByDevice(token);
        if (!cancelled) setGuest(found);
      } catch {
        if (!cancelled) setError("Gagal memuat status RSVP kamu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = useCallback(
    async (payload: Omit<RsvpPayload, "device_token">) => {
      setSubmitting(true);
      setError(null);
      try {
        const token = getDeviceToken();
        const result = await submitRsvp({ ...payload, device_token: token });
        const merged: Guest = {
          guest_id: result.guest_id,
          fullname: result.fullname,
          email: payload.email,
          rsvp_status: result.rsvp_status,
          qrcode_image: result.qrcode_image,
          message: result.message,
        };
        setGuest(merged);
        return { guest: merged, emailSent: result.email_sent };
      } catch {
        setError("Gagal mengirim RSVP. Coba lagi ya.");
        throw new Error("submit-failed");
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  return { guest, loading, submitting, error, submit };
}
