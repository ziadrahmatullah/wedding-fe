import { useCallback, useEffect, useState } from "react";
import { fetchRsvpMessages } from "../lib/api";
import type { RsvpMessage } from "../types/api";

const PAGE_SIZE = 3;

/**
 * Messages render newest-first, which is exactly the order the backend
 * returns (desc) — no reordering needed. "Load older" pages backward from
 * the last visible item and appends below.
 */
export function useRsvpMessages() {
  const [messages, setMessages] = useState<RsvpMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchRsvpMessages({ limit: PAGE_SIZE });
        if (cancelled) return;
        setMessages(res.data);
        setHasMore(res.has_more);
      } catch {
        if (!cancelled) setError("Gagal memuat ucapan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadOlder = useCallback(async () => {
    if (messages.length === 0) return;
    setLoadingMore(true);
    setError(null);
    try {
      const oldestVisible = messages[messages.length - 1].created_at;
      const res = await fetchRsvpMessages({
        limit: PAGE_SIZE,
        before: oldestVisible,
      });
      setMessages((prev) => [...prev, ...res.data]);
      setHasMore(res.has_more);
    } catch {
      setError("Gagal memuat ucapan lebih lama.");
    } finally {
      setLoadingMore(false);
    }
  }, [messages]);

  return { messages, hasMore, loading, loadingMore, error, loadOlder };
}
