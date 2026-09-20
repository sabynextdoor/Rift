import { useState, useRef } from 'react';

// Configuration
const COOLDOWN_MS = 1000; // 1 second cooldown - prevents spam but allows frequent winks

export function useRiftWink() {
  const [shouldWink, setShouldWink] = useState(false);
  const lastWinkTime = useRef(0);

  const triggerWink = () => {
    const now = Date.now();
    const timeSinceLastWink = now - lastWinkTime.current;

    // Check cooldown to prevent spam
    if (timeSinceLastWink < COOLDOWN_MS) {
      return;
    }

    // Always trigger wink on eligible interaction
    setShouldWink(true);
    lastWinkTime.current = now;

    // Reset after animation completes (~850ms)
    setTimeout(() => {
      setShouldWink(false);
    }, 850);
  };

  const forceWink = () => {
    const now = Date.now();
    const timeSinceLastWink = now - lastWinkTime.current;

    // Respect cooldown even for forced winks
    if (timeSinceLastWink < COOLDOWN_MS) {
      return;
    }

    setShouldWink(true);
    lastWinkTime.current = now;

    setTimeout(() => {
      setShouldWink(false);
    }, 850);
  };

  return { shouldWink, triggerWink, forceWink };
}

// Eligible interaction types
export const ELIGIBLE_INTERACTIONS = [
  'logo_click',
  'upload_start',
  'upload_complete',
  'transfer_ready',
  'copy_link',
  'qr_open',
  'download_start',
  'download_complete',
] as const;

export type EligibleInteraction = typeof ELIGIBLE_INTERACTIONS[number];
