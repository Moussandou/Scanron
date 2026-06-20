import { useCallback, useState } from 'react';

export const ONBOARDING_DONE_KEY = 'scanron_onboarding_done';

function isDone(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_DONE_KEY) === '1';
  } catch {
    return true; // no storage → don't nag
  }
}

function markDone() {
  try {
    localStorage.setItem(ONBOARDING_DONE_KEY, '1');
  } catch {
    /* ignore */
  }
}

export interface Onboarding {
  active: boolean;
  step: number;
  next: () => void;
  skip: () => void;
  finish: () => void;
  start: () => void;
}

/**
 * First-run guided tour state. Activates automatically the first time the dashboard
 * mounts (when the completion flag is unset), and never reappears once skipped or
 * finished. `stepCount` is the number of steps so `next` can finish on the last one.
 */
export function useOnboarding(stepCount: number): Onboarding {
  const [active, setActive] = useState(() => !isDone());
  const [step, setStep] = useState(0);

  const finish = useCallback(() => {
    markDone();
    setActive(false);
  }, []);

  const skip = finish;

  const next = useCallback(() => {
    setStep((s) => {
      if (s >= stepCount - 1) {
        finish();
        return s;
      }
      return s + 1;
    });
  }, [stepCount, finish]);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  return { active, step, next, skip, finish, start };
}
