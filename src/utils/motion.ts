// RIFT Motion System - Premium Animation Tokens
// Philosophy: "Invisible until interaction. Beautiful during interaction. Instant when finished."

export const motion = {
  // Durations
  fast: 0.15,      // 150ms - micro interactions
  standard: 0.25,  // 250ms - normal transitions
  slow: 0.4,       // 400ms - larger transitions
  slower: 0.6,     // 600ms - major state changes
  brand: 0.8,      // 800ms - signature moments

  // Easings - Custom curves for premium feel
  easeOut: [0.16, 1, 0.3, 1] as const,      // Fast out, smooth landing
  easeInOut: [0.65, 0, 0.35, 1] as const,   // Balanced
  easeIn: [0.7, 0, 0.84, 0] as const,       // Slow start, fast end
  
  // Spring presets - For physical, responsive feel
  spring: {
    soft: { type: 'spring', stiffness: 100, damping: 20 },
    snappy: { type: 'spring', stiffness: 300, damping: 25 },
    gentle: { type: 'spring', stiffness: 80, damping: 30 },
    precise: { type: 'spring', stiffness: 400, damping: 35 },
  },

  // Stagger values for orchestrated animations
  stagger: {
    fast: 0.05,   // 50ms between items
    normal: 0.1,  // 100ms between items
    slow: 0.15,   // 150ms between items
  },

  // Scale values
  scale: {
    hover: 1.02,      // Subtle hover
    press: 0.98,      // Button press
    enter: 0.95,      // Element entering
    exit: 0.9,        // Element exiting
  },

  // Distance values
  distance: {
    micro: 2,    // 2px - micro interactions
    small: 4,    // 4px - small movements
    medium: 8,   // 8px - normal movements
    large: 16,   // 16px - large movements
  },

  // Opacity values
  opacity: {
    subtle: 0.6,   // Subtle fade
    medium: 0.4,   // Medium fade
    strong: 0.2,   // Strong fade
    ghost: 0.1,    // Very subtle
  },
} as const;

// Signature RIFT Motion Variants
export const riftVariants = {
  // File entering RIFT - compression and absorption
  fileEnter: {
    initial: { scale: 1, opacity: 1 },
    compress: { scale: 0.3, opacity: 0.8, transition: { duration: motion.fast } },
    absorb: { scale: 0, opacity: 0, transition: { duration: motion.fast } },
  },

  // Proximity detection - two nodes connecting
  proximity: {
    idle: { scale: 1, opacity: 0.6 },
    detecting: { scale: 1.1, opacity: 0.8 },
    connecting: { scale: 1.05, opacity: 1 },
    connected: { scale: 1, opacity: 1 },
  },

  // RIFT READY - signature resolution moment
  ready: {
    initial: { scale: 0.9, opacity: 0 },
    converge: { scale: 1.05, opacity: 1, transition: { duration: motion.brand } },
    resolve: { scale: 1, opacity: 1, transition: { duration: motion.slow } },
  },

  // Transfer pulse - data moving through RIFT
  transfer: {
    pulse: {
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
  },

  // File queue item
  queueItem: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { ...motion.spring.snappy } },
    exit: { x: 20, opacity: 0, transition: { duration: motion.fast } },
  },

  // Modal/Sheet
  modal: {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { ...motion.spring.gentle } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: motion.standard } },
  },

  // Button press
  button: {
    hover: { scale: motion.scale.hover, transition: { duration: motion.fast } },
    press: { scale: motion.scale.press, transition: { duration: motion.fast } },
  },

  // Dropzone states
  dropzone: {
    idle: { scale: 1, borderColor: 'var(--color-border)' },
    hover: { scale: 1.01, borderColor: 'var(--color-border-hover)' },
    active: { scale: 1.02, borderColor: 'var(--color-accent)' },
  },
} as const;

// Reduced motion support
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get motion config based on user preference
export const getMotionConfig = () => {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      spring: { type: 'tween', duration: 0.01 },
    };
  }
  return motion;
};
