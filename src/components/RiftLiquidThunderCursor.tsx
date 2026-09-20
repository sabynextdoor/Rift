import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface LiquidState {
  level: number; // 0-100 percentage
  tilt: number; // -1 to 1 for left/right tilt
  velocity: number; // current velocity
  waves: Array<{ id: number; amplitude: number; frequency: number; phase: number }>;
}

interface ClickState {
  isClicking: boolean;
  compression: number; // 0-1
  splashIntensity: number; // 0-1
  glowIntensity: number; // 0-1
  shake: { x: number; y: number };
}

export default function RiftLiquidThunderCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [liquidState, setLiquidState] = useState<LiquidState>({
    level: 45,
    tilt: 0,
    velocity: 0,
    waves: [],
  });
  const [clickState, setClickState] = useState<ClickState>({
    isClicking: false,
    compression: 0,
    splashIntensity: 0,
    glowIntensity: 0,
    shake: { x: 0, y: 0 },
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>();
  const waveIdRef = useRef(0);

  // Spring physics for smooth cursor following
  const cursorX = useSpring(0, { stiffness: 500, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 50 });

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      
      // Calculate velocity
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      velocityRef.current = { x: dx, y: dy };
      lastPosRef.current = { x: e.clientX, y: e.clientY };

      // Update cursor position with spring
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Update liquid physics based on velocity
      if (!prefersReducedMotion) {
        const tilt = Math.max(-1, Math.min(1, dx * 0.02));
        const waveAmplitude = Math.min(8, velocity * 0.1);
        
        // Add wave if moving fast enough
        if (velocity > 5 && Math.random() > 0.7) {
          addWave(waveAmplitude);
        }

        setLiquidState(prev => ({
          ...prev,
          tilt: prev.tilt * 0.9 + tilt * 0.1, // Smooth tilt
          velocity: velocity,
        }));
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      if (!prefersReducedMotion) {
        triggerClickAnimation();
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation loop for liquid physics
    const animate = () => {
      if (!prefersReducedMotion) {
        // Update waves
        setLiquidState(prev => ({
          ...prev,
          waves: prev.waves
            .map(wave => ({
              ...wave,
              amplitude: wave.amplitude * 0.95, // Decay
              phase: wave.phase + 0.1,
            }))
            .filter(wave => wave.amplitude > 0.1), // Remove tiny waves
          tilt: prev.tilt * 0.95, // Settle tilt
        }));

        // Update click state
        setClickState(prev => ({
          ...prev,
          compression: prev.compression * 0.9,
          splashIntensity: prev.splashIntensity * 0.92,
          glowIntensity: prev.glowIntensity * 0.95,
          shake: {
            x: prev.shake.x * 0.85,
            y: prev.shake.y * 0.85,
          },
        }));
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cursorX, cursorY, prefersReducedMotion]);

  const addWave = (amplitude: number) => {
    const newWave = {
      id: waveIdRef.current++,
      amplitude,
      frequency: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    };

    setLiquidState(prev => ({
      ...prev,
      waves: [...prev.waves.slice(-4), newWave], // Keep max 5 waves
    }));
  };

  const triggerClickAnimation = () => {
    // Compression
    setClickState(prev => ({
      ...prev,
      isClicking: true,
      compression: 0.06,
    }));

    // Splash
    setTimeout(() => {
      setClickState(prev => ({
        ...prev,
        splashIntensity: 1,
        glowIntensity: 0.8,
      }));
      addWave(6);
    }, 80);

    // Shake
    setTimeout(() => {
      setClickState(prev => ({
        ...prev,
        shake: {
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 2,
        },
      }));
    }, 120);

    // Settle
    setTimeout(() => {
      setClickState(prev => ({
        ...prev,
        isClicking: false,
      }));
    }, 400);
  };

  // Calculate liquid surface path with waves
  const calculateLiquidPath = () => {
    const width = 24;
    const height = 32;
    const liquidHeight = (liquidState.level / 100) * height;
    const baseY = height - liquidHeight;

    let path = `M 0 ${baseY}`;

    // Add waves
    const wavePoints = 20;
    for (let i = 0; i <= wavePoints; i++) {
      const x = (i / wavePoints) * width;
      let y = baseY;

      // Apply tilt
      y += liquidState.tilt * (x - width / 2) * 0.3;

      // Apply waves
      liquidState.waves.forEach(wave => {
        y += Math.sin((x / width) * wave.frequency * Math.PI * 2 + wave.phase) * wave.amplitude;
      });

      // Apply splash
      if (clickState.splashIntensity > 0.1) {
        y -= Math.sin((x / width) * Math.PI) * clickState.splashIntensity * 4;
      }

      path += ` L ${x} ${y}`;
    }

    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  };

  if (prefersReducedMotion) {
    // Static cursor for reduced motion
    return (
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
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
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isClicking ? 0.94 : 1,
      }}
      transition={{ 
        opacity: { duration: 0.2 },
        scale: { duration: 0.15, ease: 'easeOut' },
      }}
    >
      <div
        style={{
          transform: `translate(${clickState.shake.x}px, ${clickState.shake.y}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <defs>
            {/* Thunder shape clip path */}
            <clipPath id="thunderClip">
              <path d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z" />
            </clipPath>

            {/* Liquid gradient */}
            <linearGradient id="liquidGradient" x1="16" y1="10" x2="16" y2="22">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.9)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.8)" />
              <stop offset="100%" stopColor="rgba(192, 132, 252, 0.7)" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="liquidGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

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
            opacity={0.3 + clickState.glowIntensity * 0.5}
          />

          {/* Thunder container (glass body) */}
          <path
            d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z"
            fill="rgba(20, 20, 30, 0.3)"
            stroke="rgba(139, 92, 246, 0.4)"
            strokeWidth="0.5"
          />

          {/* Liquid inside thunder (clipped) */}
          <g clipPath="url(#thunderClip)">
            {/* Liquid body */}
            <path
              d={calculateLiquidPath()}
              fill="url(#liquidGradient)"
              filter="url(#liquidGlow)"
              opacity={0.8 + clickState.glowIntensity * 0.2}
            />

            {/* Liquid surface highlight */}
            <path
              d={calculateLiquidPath()}
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.5"
              opacity={0.5 + clickState.splashIntensity * 0.3}
            />

            {/* Internal particles */}
            {liquidState.waves.map((wave, i) => (
              <circle
                key={wave.id}
                cx={8 + (i * 4)}
                cy={20 - wave.amplitude}
                r="0.5"
                fill="rgba(255, 255, 255, 0.6)"
                opacity={wave.amplitude / 8}
              />
            ))}

            {/* Click splash particles */}
            {clickState.splashIntensity > 0.1 && (
              <>
                <circle
                  cx="14"
                  cy="18"
                  r="0.8"
                  fill="rgba(255, 255, 255, 0.8)"
                  opacity={clickState.splashIntensity}
                />
                <circle
                  cx="18"
                  cy="16"
                  r="0.6"
                  fill="rgba(255, 255, 255, 0.7)"
                  opacity={clickState.splashIntensity * 0.8}
                />
                <circle
                  cx="16"
                  cy="20"
                  r="0.7"
                  fill="rgba(255, 255, 255, 0.75)"
                  opacity={clickState.splashIntensity * 0.9}
                />
              </>
            )}
          </g>

          {/* Thunder outline (on top) */}
          <path
            d="M16 2L8 14H14L12 22L24 10H18L20 2L16 2Z"
            fill="none"
            stroke="rgba(139, 92, 246, 0.6)"
            strokeWidth="0.5"
            opacity={0.8 + clickState.glowIntensity * 0.2}
          />

          {/* Click spark */}
          {clickState.splashIntensity > 0.3 && (
            <circle
              cx="16"
              cy="12"
              r="1"
              fill="white"
              opacity={clickState.splashIntensity}
              filter="url(#liquidGlow)"
            />
          )}
        </svg>
      </div>
    </motion.div>
  );
}
