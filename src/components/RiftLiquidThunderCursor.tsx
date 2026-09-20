import { useEffect, useRef, useState } from 'react';

export default function RiftLiquidThunderCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  useEffect(() => {
    // Hide default cursor on desktop
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      
      // Direct positioning - no lag, instant response
      posRef.current = { x: e.clientX, y: e.clientY };
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (prefersReducedMotion) {
    // Static cursor for reduced motion
    return (
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z"
            fill="url(#staticGradient)"
            stroke="rgba(139, 92, 246, 0.6)"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="staticGradient" x1="16" y1="2" x2="16" y2="22">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s, transform 0.1s ease-out',
        transform: `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%) scale(${isClicking ? 0.94 : 1})`,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <defs>
          {/* Thunder shape clip path */}
          <clipPath id="thunderClip">
            <path d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z" />
          </clipPath>

          {/* Simple liquid gradient */}
          <linearGradient id="liquidGradient" x1="16" y1="10" x2="16" y2="22">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.9)" />
            <stop offset="100%" stopColor="rgba(192, 132, 252, 0.7)" />
          </linearGradient>

          {/* Outer glow */}
          <radialGradient id="outerGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>
        </defs>

        {/* Outer glow aura */}
        <circle
          cx="16"
          cy="16"
          r="18"
          fill="url(#outerGlow)"
          opacity={isClicking ? 0.6 : 0.3}
          style={{ transition: 'opacity 0.2s' }}
        />

        {/* Thunder container (glass body) */}
        <path
          d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z"
          fill="rgba(20, 20, 30, 0.3)"
          stroke="rgba(139, 92, 246, 0.4)"
          strokeWidth="0.5"
        />

        {/* Liquid inside thunder (simplified - no physics) */}
        <g clipPath="url(#thunderClip)">
          {/* Static liquid fill at 45% */}
          <rect
            x="0"
            y="14"
            width="32"
            height="18"
            fill="url(#liquidGradient)"
            opacity={0.8}
          />

          {/* Simple liquid surface highlight */}
          <ellipse
            cx="16"
            cy="14"
            rx="12"
            ry="1"
            fill="rgba(255, 255, 255, 0.3)"
          />
        </g>

        {/* Thunder outline (on top) */}
        <path
          d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z"
          fill="none"
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth="0.5"
          opacity={isClicking ? 1 : 0.8}
          style={{ transition: 'opacity 0.2s' }}
        />

        {/* Click spark (simple) */}
        {isClicking && (
          <circle
            cx="16"
            cy="12"
            r="1.5"
            fill="white"
            opacity="0.8"
          />
        )}
      </svg>
    </div>
  );
}
