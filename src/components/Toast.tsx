import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-[400px] rounded-xl bg-primary-dark px-4 py-3 text-sm text-white shadow-lg"
          role="alert"
        >
          <div className="flex items-center justify-between gap-3">
            <span>{message}</span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-white/80 hover:text-white"
              aria-label="Tutup notifikasi"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
