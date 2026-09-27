"use client";

import { useEffect, useState } from "react";

// Steps through 0..stepCount-1 once per `play token`, then holds on the
// last step. Call replay() to run the sequence again from the start.
export function usePlayOnce(stepCount, durationMs = 3000) {
  const [step, setStep] = useState(0);
  const [playToken, setPlayToken] = useState(0);

  useEffect(() => {
    setStep(0);
    if (stepCount <= 1) return;

    let cancelled = false;

    function scheduleNext(index) {
      const duration = Array.isArray(durationMs) ? durationMs[index] : durationMs;
      setTimeout(() => {
        if (cancelled) return;
        const next = index + 1;
        setStep(next);
        if (next < stepCount - 1) scheduleNext(next);
      }, duration);
    }

    scheduleNext(0);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepCount, playToken]);

  const replay = () => setPlayToken((t) => t + 1);

  return [step, replay];
}
