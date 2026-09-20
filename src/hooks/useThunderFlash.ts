import { useState, useCallback } from 'react';

// Hook for triggering thunder flash on various actions
export function useThunderFlash() {
  const [trigger, setTrigger] = useState(false);

  const flash = useCallback(() => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 600);
  }, []);

  return { trigger, flash };
}

// Predefined flash variations
export const THUNDER_VARIATIONS = {
  TRANSFER_COMPLETE: 'normal' as const,
  UPLOAD_COMPLETE: 'small' as const,
  DOWNLOAD_COMPLETE: 'small' as const,
  LINK_CREATED: 'micro' as const,
  COPY_LINK: 'micro' as const,
  QR_GENERATED: 'micro' as const,
  PROXIMITY_CONNECTION: 'small' as const,
};
