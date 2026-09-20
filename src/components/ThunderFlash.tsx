import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ThunderFlashProps {
  trigger: boolean;
  onComplete?: () => void;
  size?: 'micro' | 'small' | 'normal';
}

export default function ThunderFlash({ trigger, onComplete, size = 'normal' }: ThunderFlashProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  const sizeMap = {
    micro: { scale: 0.5, particleCount: 3, particleDistance: 8 },
    small: { scale: 0.75, particleCount: 5, particleDistance: 12 },
    normal: { scale: 1, particleCount: 8, particleDistance: 16 },
  };

  const config = sizeMap[size];

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      
      // Generate micro particles
      const newParticles = Array.from({ length: config.particleCount }, (_, i) => ({
        id: i,
        angle: (i / config.particleCount) * Math.PI * 2,
        distance: config.particleDistance,
      }));
      setParticles(newParticles);

      // Complete after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        setParticles([]);
        onComplete?.();
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [trigger, config, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Localized micro-flash */}
      <motion.div
        className="absolute rounded-full bg-accent/30 blur-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 2, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 0.4,
          times: [0, 0.3, 1],
          ease: 'easeOut',
        }}
        style={{
          width: `${40 * config.scale}px`,
          height: `${40 * config.scale}px`,
        }}
      />

      {/* RIFT thunder symbol */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.2, 1, 0.3, 0],
          opacity: [0, 1, 1, 0.5, 0],
        }}
        transition={{
          duration: 0.55,
          times: [0, 0.15, 0.3, 0.7, 1],
          ease: 'easeOut',
        }}
        style={{
          transform: `scale(${config.scale})`,
        }}
      >
        {/* Sharp flash */}
        <motion.div
          className="absolute inset-0 bg-white rounded-full blur-md"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 0.16,
            times: [0, 0.5, 1],
            delay: 0.08,
          }}
        />

        {/* RIFT logo (thunder symbol) */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          className="relative z-10"
        >
          <motion.path
            d="M3 2L8 14L13 2"
            stroke="#663af3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 0.3,
              times: [0, 0.3, 1],
              ease: 'easeOut',
            }}
          />
          <motion.path
            d="M5 8H11"
            stroke="#663af3"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 0.2,
              delay: 0.1,
              times: [0, 0.5, 1],
              ease: 'easeOut',
            }}
          />
        </svg>
      </motion.div>

      {/* Micro particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-accent"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: Math.cos(particle.angle) * particle.distance,
              y: Math.sin(particle.angle) * particle.distance,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.3, 1],
              ease: 'easeOut',
              delay: 0.16,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Liquid glass distortion */}
      <motion.div
        className="absolute rounded-full bg-accent/20 blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 0.4,
          delay: 0.08,
          ease: 'easeOut',
        }}
        style={{
          width: `${60 * config.scale}px`,
          height: `${60 * config.scale}px`,
        }}
      />
    </div>
  );
}

// Hook for triggering thunder flash
export function useThunderFlash() {
  const [trigger, setTrigger] = useState(false);

  const flash = () => {
    setTrigger(true);
    setTimeout(() => setTrigger(false), 600);
  };

  return { trigger, flash };
}
