import { useState } from "react";
import type { FormEvent } from "react";
import { BookPageInner } from "../components/BookPageInner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Popup } from "../components/Popup";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { Toast } from "../components/Toast";
import { useBookPageTransform } from "../hooks/useBookPageTransform";
import { BackgroundBlobs } from "../svg/BackgroundBlobs";
import { FloralDivider } from "../svg/FloralDivider";
import { useGuestRsvp } from "../hooks/useGuestRsvp";
import { createQrisPayment } from "../lib/api";
import type { Guest, RsvpStatus } from "../types/api";

const STATUS_OPTIONS: { value: RsvpStatus; label: string }[] = [
  { value: "attending", label: "InshaaAllah Hadir" },
  { value: "not_attending", label: "Maaf, Belum Bisa Hadir" },
  { value: "unsure", label: "Belum Tau Nih" },
];

const STATUS_TEXT: Record<RsvpStatus, string> = {
  attending: "InshaaAllah Hadir",
  not_attending: "Belum Bisa Hadir",
  unsure: "Belum Tau",
};

const BANK_ACCOUNTS = [
  { bank: "BCA", number: "8990862819", holder: "Muhammad Ziad Rahmatullah" },
  { bank: "Seabank", number: "901663407152", holder: "Zainab" },
];

const GIFT_ADDRESS =
  "Gang Ks Blok Kaliwon, RT.5/RW.2, Desa Windujanten, Kadugede no. 252, Kab. Kuningan, Kadugede, Jawa Barat, ID, 45561";

function QrConfirmation({
  guest,
  emailNotice,
}: {
  guest: Guest;
  emailNotice: boolean;
}) {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      {guest.qrcode_image && (
        <img
          src={guest.qrcode_image}
          alt="QR code konfirmasi kehadiran"
          className="h-40 w-40 rounded-lg border border-accent-gold/30"
        />
      )}
      <p className="text-center text-xs text-text-soft">
        Reservasi sudah tercatat.
        {emailNotice && (
          <>
            <br />
            Sudah dikirim ke email kamu.
          </>
        )}
        <br />
        Mohon screenshot QR ini dan tunjukkan saat hadir di acara.
      </p>
    </div>
  );
}

export function RSVPSection() {
  const { ref, enabled, rotateY, shadowOpacity } = useBookPageTransform<HTMLElement>();
  const { guest, loading, submitting, error, submit } = useGuestRsvp();
  const [view, setView] = useState<"closed" | "form" | "result">("closed");
  const [status, setStatus] = useState<RsvpStatus>("attending");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [resultGuest, setResultGuest] = useState<Guest | null>(null);
  const [resultEmailSent, setResultEmailSent] = useState(false);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const toastMsg = error && error !== dismissedError ? error : null;

  const [amplopStep, setAmplopStep] = useState<
    "closed" | "options" | "qris" | "bank"
  >("closed");
  const [qrisName, setQrisName] = useState("");
  const [qrisSubmitting, setQrisSubmitting] = useState(false);
  const [qrisError, setQrisError] = useState<string | null>(null);
  const [qrisShown, setQrisShown] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  async function copyAccountNumber(number: string) {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedAccount(number);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch {
      // clipboard unavailable; ignore
    }
  }

  function openAmplop() {
    setAmplopStep("options");
    setQrisName("");
    setQrisError(null);
    setQrisShown(false);
  }

  async function handleQrisSubmit(e: FormEvent) {
    e.preventDefault();
    if (!qrisName.trim()) {
      setQrisError("Nama wajib diisi.");
      return;
    }
    setQrisError(null);
    setQrisSubmitting(true);
    try {
      await createQrisPayment({ nama: qrisName.trim() });
      setQrisShown(true);
    } catch {
      setQrisError("Gagal membuat QR. Silakan coba lagi.");
    } finally {
      setQrisSubmitting(false);
    }
  }

  function openForm(preset: RsvpStatus) {
    setStatus(guest?.rsvp_status ?? preset);
    setFullname(guest?.fullname ?? "");
    setEmail(guest?.email ?? "");
    setMessage(guest?.message ?? "");
    setFormError(null);
    setView("form");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullname.trim()) {
      setFormError("Nama lengkap wajib diisi.");
      return;
    }
    setFormError(null);
    try {
      const { guest: updated, emailSent } = await submit({
        fullname: fullname.trim(),
        email: email.trim() ? email.trim() : null,
        rsvp_status: status,
        message: message.trim(),
      });
      setResultGuest(updated);
      setResultEmailSent(emailSent);
      setView("result");
    } catch {
      // network/server error already surfaced via toast from hook's error state
    }
  }

  return (
    <section
      ref={ref}
      className="relative snap-start overflow-hidden px-6 py-16"
      style={enabled ? { perspective: 1400 } : undefined}
    >
      <BackgroundBlobs variant="default" className="absolute inset-0 -z-10 h-full w-full" />

      <BookPageInner enabled={enabled} rotateY={rotateY} shadowOpacity={shadowOpacity}>
        <RevealOnScroll>
          <h2 className="text-center font-script text-2xl text-primary-dark">
            Konfirmasi Kehadiran
          </h2>
          <FloralDivider className="mx-auto mt-3 w-32 text-accent-gold" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="mt-8">
            {loading ? (
              <Card className="text-center text-sm text-text-soft">
                Memuat status RSVP...
              </Card>
            ) : guest ? (
              <Card>
                <p className="text-sm text-text-soft">Status kamu saat ini</p>
                <p className="mt-1 font-script text-xl text-primary-dark">
                  {STATUS_TEXT[guest.rsvp_status]}
                </p>

                {guest.rsvp_status === "attending" && (
                  <QrConfirmation guest={guest} emailNotice={Boolean(guest.email)} />
                )}

                <Button
                  variant="secondary"
                  type="button"
                  className="mt-5 w-full"
                  onClick={() => openForm(guest.rsvp_status)}
                >
                  Ubah Konfirmasi
                </Button>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                <Button type="button" onClick={() => openForm("attending")}>
                  InshaaAllah Hadir
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => openForm("not_attending")}
                >
                  Maaf, Belum Bisa Hadir
                </Button>
              </div>
            )}

            <Button
              variant="secondary"
              type="button"
              className="mt-4 w-full"
              onClick={openAmplop}
            >
              Amplop Digital
            </Button>

            <Card className="mt-6 text-center">
              <p className="font-script text-lg text-primary-dark">
                Alamat Pengiriman Hadiah
              </p>
              <p className="mt-2 text-sm text-text-soft">{GIFT_ADDRESS}</p>
              <a
                href="https://maps.app.goo.gl/FpAqdDWZkpx97e1x8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-surface px-6 py-3 font-sans text-sm font-medium text-primary-dark transition-colors hover:bg-primary/5"
              >
                Buka di Google Maps
              </a>
            </Card>
          </div>
        </RevealOnScroll>
      </BookPageInner>

      <Popup open={amplopStep !== "closed"} onClose={() => setAmplopStep("closed")}>
        {amplopStep === "options" && (
          <div className="flex flex-col gap-4">
            <h3 className="font-script text-xl text-primary-dark">
              Amplop Digital
            </h3>
            <p className="text-sm text-text-soft">
              Pilih metode pengiriman amplop digital.
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={() => setAmplopStep("qris")}
            >
              QRIS
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-full"
              onClick={() => setAmplopStep("bank")}
            >
              Transfer Bank
            </Button>
          </div>
        )}

        {amplopStep === "qris" &&
          (!qrisShown ? (
            <form onSubmit={handleQrisSubmit} className="flex flex-col gap-4">
              <h3 className="font-script text-xl text-primary-dark">QRIS</h3>
              <label className="flex flex-col gap-1 text-sm text-text">
                Nama
                <input
                  type="text"
                  value={qrisName}
                  onChange={(e) => setQrisName(e.target.value)}
                  className="rounded-lg border border-accent-gold/30 px-3 py-2 text-sm outline-none focus:border-primary"
                  required
                />
              </label>
              {qrisError && (
                <p className="text-xs text-primary-dark">{qrisError}</p>
              )}
              <Button type="submit" loading={qrisSubmitting} className="w-full">
                Tampilkan QR
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <h3 className="font-script text-xl text-primary-dark">QRIS</h3>
              <img
                src="/QR.jpeg"
                alt="QRIS pembayaran"
                className="w-full max-w-[280px] rounded-lg border border-accent-gold/30"
              />
              <p className="text-center text-xs text-text-soft">
                Scan QR di atas menggunakan aplikasi pembayaran favoritmu.
              </p>
              <a
                href="/QR.jpeg"
                download="QRIS-Amplop-Digital.jpeg"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/40 bg-surface px-6 py-3 font-sans text-sm font-medium text-primary-dark transition-colors hover:bg-primary/5"
              >
                Download QR
              </a>
            </div>
          ))}

        {amplopStep === "bank" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-center font-script text-xl text-primary-dark">
              Transfer Bank
            </h3>
            {BANK_ACCOUNTS.map((account) => (
              <div
                key={account.number}
                className="flex flex-col items-center gap-2 rounded-lg border border-accent-gold/30 px-4 py-3 text-center"
              >
                <p className="text-xs text-text-soft">{account.bank}</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-text">
                    {account.number}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyAccountNumber(account.number)}
                    aria-label="Salin nomor rekening"
                    className="rounded-full border border-primary/40 p-1.5 text-primary-dark transition-colors hover:bg-primary/5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="h-4 w-4"
                    >
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-text-soft">
                  a.n {account.holder}
                </p>
                {copiedAccount === account.number && (
                  <p className="text-xs text-primary">Tersalin!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Popup>

      <Popup open={view === "form"} onClose={() => setView("closed")}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="font-script text-xl text-primary-dark">
            Konfirmasi Kehadiran
          </h3>

          <label className="flex flex-col gap-1 text-sm text-text">
            Nama Lengkap
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="rounded-lg border border-accent-gold/30 px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-text">
            Email (opsional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-accent-gold/30 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm text-text">
              Status Kehadiran
            </legend>
            {STATUS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-text"
              >
                <input
                  type="radio"
                  name="rsvp_status"
                  value={opt.value}
                  checked={status === opt.value}
                  onChange={() => setStatus(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </fieldset>

          <label className="flex flex-col gap-1 text-sm text-text">
            Ucapan &amp; Doa (opsional)
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="rounded-lg border border-accent-gold/30 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          {formError && (
            <p className="text-xs text-primary-dark">{formError}</p>
          )}

          <Button type="submit" loading={submitting} className="w-full">
            Kirim
          </Button>
        </form>
      </Popup>

      <Popup open={view === "result"} onClose={() => setView("closed")}>
        <div className="text-center">
          <h3 className="font-script text-xl text-primary-dark">
            Terima kasih!
          </h3>
          {resultGuest?.rsvp_status === "attending" ? (
            <QrConfirmation guest={resultGuest} emailNotice={resultEmailSent} />
          ) : (
            <p className="mt-3 text-sm text-text-soft">
              Konfirmasi kamu sudah kami terima.
            </p>
          )}
          <Button
            type="button"
            className="mt-5 w-full"
            onClick={() => setView("closed")}
          >
            Tutup
          </Button>
        </div>
      </Popup>

      <Toast message={toastMsg} onDismiss={() => setDismissedError(error)} />
    </section>
  );
}
