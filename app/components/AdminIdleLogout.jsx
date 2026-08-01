"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const IDLE_TIMEOUT_SECONDS = 10 * 60;
const WARNING_SECONDS = 60;
const REFRESH_THROTTLE_MS = 60 * 1000;
const ACTIVITY_EVENTS = [
  "click",
  "keydown",
  "mousemove",
  "mousedown",
  "scroll",
  "touchstart",
  "pointerdown",
  "visibilitychange"
];

function getNow() {
  return Date.now();
}

function formatRemaining(seconds) {
  const safeSeconds = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  if (minutes <= 0) return `${remainder}s`;
  return `${minutes}m ${String(remainder).padStart(2, "0")}s`;
}

export default function AdminIdleLogout() {
  const router = useRouter();
  const timeoutMs = useMemo(() => IDLE_TIMEOUT_SECONDS * 1000, []);
  const warningMs = useMemo(() => WARNING_SECONDS * 1000, []);
  const lastActivityRef = useRef(getNow());
  const lastRefreshRef = useRef(0);
  const isLoggingOutRef = useRef(false);
  const [remainingSeconds, setRemainingSeconds] = useState(IDLE_TIMEOUT_SECONDS);
  const [showWarning, setShowWarning] = useState(false);

  async function refreshSession({ force = false } = {}) {
    const now = getNow();

    if (!force && now - lastRefreshRef.current < REFRESH_THROTTLE_MS) {
      return;
    }

    lastRefreshRef.current = now;

    try {
      const response = await fetch("/api/admin/session/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      if (!response.ok) {
        await logoutDueToInactivity();
      }
    } catch (error) {
      console.error("Admin session refresh failed:", error);
    }
  }

  async function logoutDueToInactivity() {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        cache: "no-store"
      });
    } catch (error) {
      console.error("Admin auto logout failed:", error);
    } finally {
      router.replace("/admin?reason=inactive");
      router.refresh();
    }
  }

  function recordActivity() {
    if (document.visibilityState === "hidden") {
      return;
    }

    lastActivityRef.current = getNow();
    setShowWarning(false);
    void refreshSession();
  }

  function stayLoggedIn() {
    lastActivityRef.current = getNow();
    setShowWarning(false);
    void refreshSession({ force: true });
  }

  useEffect(() => {
    void refreshSession({ force: true });

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, {
        passive: true
      });
    });

    const intervalId = window.setInterval(() => {
      const idleForMs = getNow() - lastActivityRef.current;
      const nextRemainingMs = Math.max(0, timeoutMs - idleForMs);
      const nextRemainingSeconds = Math.ceil(nextRemainingMs / 1000);

      setRemainingSeconds(nextRemainingSeconds);
      setShowWarning(nextRemainingMs > 0 && nextRemainingMs <= warningMs);

      if (nextRemainingMs <= 0) {
        void logoutDueToInactivity();
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
    };
  }, [timeoutMs, warningMs]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase">Admin session timeout</p>
          <p className="mt-1 text-sm leading-6">
            No activity detected. You will be logged out in{" "}
            <span className="font-black">{formatRemaining(remainingSeconds)}</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={stayLoggedIn}
          className="shrink-0 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black uppercase text-white hover:bg-slate-800"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
}
