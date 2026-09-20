import { useState, useRef } from 'react';

// Configuration
const WINK_CHANCE = 0.10; // 10% chance
const COOLDOWN_MS = 10000; // 10 seconds cooldown

export function useRiftWink() {
  const [shouldWink, setShouldWink] = useState(false);
  const lastWinkTime = useRef(0);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerWink = () => {
    const now = Date.now();
    const timeSinceLastWink = now - lastWinkTime.current;

    // Check cooldown
    if (timeSinceLastWink < COOLDOWN_MS) {
      return;
    }

    // Random chance
    if (Math.random() < WINK_CHANCE) {
      setShouldWink(true);
      lastWinkTime.current = now;

      // Reset after animation completes (~850ms)
      setTimeout(() => {
        setShouldWink(false);
      }, 850);
    }
  };

  const forceWink = () => {
    const now = Date.now();
    const timeSinceLastWink = now - lastWinkTime.current;

    // Still respect cooldown for forced winks
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
