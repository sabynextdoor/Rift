// RIFT Liquid Glass Material System
// Creates a premium, physical glass/liquid membrane effect

export const liquidGlass = {
  // Material properties
  material: {
    opacity: 0.08,
    blur: 20,
    saturation: 120,
    border: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(255, 255, 255, 0.15)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  // Physics
  physics: {
    surfaceTension: 0.8,
    viscosity: 0.6,
    elasticity: 0.4,
    rippleSpeed: 0.3,
  },

  // Animation timings
  timing: {
    form: 0.4,      // Material forming
    ripple: 0.6,    // Ripple expansion
    settle: 0.8,    // Settling after interaction
    transform: 1.0, // State transformation
  },

  // Easing curves
  easing: {
    liquid: [0.4, 0, 0.2, 1],
    surface: [0.25, 0.1, 0.25, 1],
    ripple: [0.4, 0, 0.6, 1],
  },
} as const;

// Generate liquid glass CSS
export function getLiquidGlassCSS(variant: 'default' | 'active' | 'processing' = 'default') {
  const base = {
    background: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, ${liquidGlass.material.opacity}) 0%,
        rgba(255, 255, 255, ${liquidGlass.material.opacity * 0.5}) 50%,
        rgba(255, 255, 255, ${liquidGlass.material.opacity}) 100%
      )
    `,
    backdropFilter: `blur(${liquidGlass.material.blur}px) saturate(${liquidGlass.material.saturation}%)`,
    WebkitBackdropFilter: `blur(${liquidGlass.material.blur}px) saturate(${liquidGlass.material.saturation}%)`,
    border: `1px solid ${liquidGlass.material.border}`,
    boxShadow: `
      inset 0 1px 1px ${liquidGlass.material.highlight},
      0 8px 32px ${liquidGlass.material.shadow}
    `,
  };

  if (variant === 'active') {
    return {
      ...base,
      border: `1px solid rgba(10, 132, 255, 0.3)`,
      boxShadow: `
        inset 0 1px 1px rgba(10, 132, 255, 0.2),
        0 8px 32px rgba(10, 132, 255, 0.15)
      `,
    };
  }

  if (variant === 'processing') {
    return {
      ...base,
      background: `
        linear-gradient(
          135deg,
          rgba(10, 132, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.05) 50%,
          rgba(10, 132, 255, 0.08) 100%
        )
      `,
    };
  }

  return base;
}

// Ripple effect generator
export function createRipple(x: number, y: number, container: HTMLElement) {
  const ripple = document.createElement('div');
  ripple.className = 'liquid-ripple';
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(10, 132, 255, 0.3) 0%,
      rgba(10, 132, 255, 0.1) 50%,
      transparent 100%
    );
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: liquid-ripple ${liquidGlass.timing.ripple}s ${liquidGlass.easing.ripple.join(',')} forwards;
  `;

  container.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, liquidGlass.timing.ripple * 1000);
}
