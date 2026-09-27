"use client";

import { useEffect, useState } from "react";

// Steps through 0..stepCount-1 once per `play token`, then holds on the
// last step. Call replay() to run the sequence again from the start.
export function usePlayOnce(stepCount, durationMs = 3000) {
  const [playToken, setPlayToken] = useState(0);
  const [prevToken, setPrevToken] = useState(playToken);
  const [step, setStep] = useState(0);

  // Reset step when a replay starts. Adjusting state during render (rather
  // than in an effect) avoids an extra render pass — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (playToken !== prevToken) {
    setPrevToken(playToken);
    setStep(0);
  }

  useEffect(() => {
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
