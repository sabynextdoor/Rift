import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RiftWinkProps {
  trigger: boolean;
  onComplete?: () => void;
  size?: number;
}

export function RiftWink({ trigger, onComplete, size = 48 }: RiftWinkProps) {
  const [phase, setPhase] = useState<'idle' | 'anticipation' | 'wink' | 'spark' | 'recovery'>('idle');
  const [sparkParticles, setSparkParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);

  useEffect(() => {
    if (trigger && phase === 'idle') {
      startAnimation();
    }
  }, [trigger]);

  const startAnimation = async () => {
    // Phase 1: Anticipation (80-120ms)
    setPhase('anticipation');
    await delay(100);

    // Phase 2: Wink (220-300ms)
    setPhase('wink');
    await delay(260);

    // Phase 3: Spark (180-260ms)
    setPhase('spark');
    generateSparkParticles();
    await delay(220);

    // Phase 4: Recovery (180-240ms)
    setPhase('recovery');
    await delay(200);

    // Complete
    setPhase('idle');
    setSparkParticles([]);
    onComplete?.();
  };

  const generateSparkParticles = () => {
    const count = 2 + Math.floor(Math.random() * 3); // 2-4 particles
    const particles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    }));
    setSparkParticles(particles);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Animation variants
  const iconVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      skewX: 0,
      skewY: 0,
    },
    anticipation: {
      scale: 1.025,
      x: 1,
      y: -1,
      transition: { duration: 0.1, ease: 'easeOut' },
    },
    wink: {
      scale: [1.025, 1.04, 1.025],
      skewX: [0, -2, 1, 0],
      skewY: [0, 0.5, -0.5, 0],
      transition: { duration: 0.26, ease: [0.4, 0, 0.2, 1] },
    },
    recovery: {
      scale: 1,
      skewX: 0,
      skewY: 0,
      x: 0,
      y: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const highlightVariants = {
    idle: { opacity: 0, x: '-100%' },
    wink: {
      opacity: [0, 0.3, 0],
      x: ['-100%', '100%'],
      transition: { duration: 0.26, ease: 'easeInOut' },
    },
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Main icon with wink animation */}
      <motion.div
        className="relative"
        variants={iconVariants}
        animate={phase}
        initial="idle"
      >
        {/* Glass highlight effect */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          variants={highlightVariants}
          animate={phase === 'wink' ? 'wink' : 'idle'}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>

        {/* RIFT thunder icon */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <path
            d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
            fill="currentColor"
            className="text-violet-500"
          />
        </svg>
      </motion.div>

      {/* Spark effect */}
      <AnimatePresence>
        {phase === 'spark' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* Primary spark */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
              style={{ x: '-50%', y: '-50%' }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />

            {/* Spark particles */}
            {sparkParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-violet-300 rounded-full"
                style={{ x: '-50%', y: '-50%' }}
                initial={{ scale: 0, opacity: 1, x: '-50%', y: '-50%' }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: `calc(-50% + ${Math.cos(particle.angle) * 12}px)`,
                  y: `calc(-50% + ${Math.sin(particle.angle) * 12}px)`,
                }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              />
            ))}

            {/* Spark glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-violet-400/30 rounded-full blur-sm"
              style={{ x: '-50%', y: '-50%' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
