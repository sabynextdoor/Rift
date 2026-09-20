import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  RiftTransferState,
  Particle,
  DEFAULT_PROXIMITY_CONFIG,
  TIMING,
} from '../utils/riftTransfer';
import ParticleSystem, { createParticle, updateParticle, isParticleAlive } from './ParticleSystem';
import RiftSeam from './RiftSeam';
import ThunderFlash from './ThunderFlash';

interface RiftTransferExperienceProps {
  sourceLabel?: string;
  destinationLabel?: string;
  progress?: number; // 0-100
  status: RiftTransferState;
  fileName?: string;
  onStateChange?: (state: RiftTransferState) => void;
}

export default function RiftTransferExperience({
  sourceLabel = 'Source',
  destinationLabel = 'Destination',
  progress = 0,
  status,
  fileName,
  onStateChange,
}: RiftTransferExperienceProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [thunderTrigger, setThunderTrigger] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const config = DEFAULT_PROXIMITY_CONFIG;

  // Particle animation loop
  useEffect(() => {
    const animate = () => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => updateParticle(p))
          .filter(isParticleAlive);
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate particles based on state
  useEffect(() => {
    if (status === 'transferring' && progress > 0 && progress < 100) {
      // Generate particles flowing through the seam
      const interval = setInterval(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Create particles from source side
        const newParticles = Array.from({ length: 2 }, () =>
          createParticle(
            centerX - 60 + Math.random() * 20,
            centerY + (Math.random() - 0.5) * 40,
            centerX,
            centerY,
            '#663af3'
          )
        );

        setParticles((prev) => [...prev, ...newParticles].slice(-config.particleCount));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [status, progress, config.particleCount]);

  // Thunder flash on completion
  useEffect(() => {
    if (status === 'complete') {
      setThunderTrigger(true);
      const timer = setTimeout(() => setThunderTrigger(false), 600);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getEndpointOpacity = () => {
    if (status === 'idle') return 0.4;
    if (status === 'approaching') return 0.6;
    if (status === 'proximity' || status === 'connected') return 0.8;
    return 1;
  };

  const getSeamState = () => {
    return status === 'seam_open' || status === 'transferring' || status === 'reconstructing';
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto py-16 px-8"
      style={{ minHeight: '300px' }}
    >
      {/* Particle system */}
      <ParticleSystem
        particles={particles}
        width={containerRef.current?.offsetWidth || 800}
        height={containerRef.current?.offsetHeight || 300}
      />

      {/* Source endpoint */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: getEndpointOpacity(),
          x: status === 'approaching' || status === 'proximity' ? 20 : 0,
        }}
        transition={{ duration: TIMING.PROXIMITY_RESPONSE / 1000 }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* RIFT icon with magnetic field */}
          <div className="relative">
            {/* Magnetic field visualization */}
            {(status === 'proximity' || status === 'connected') && (
              <motion.div
                className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            {/* RIFT symbol */}
            <motion.div
              className="relative w-16 h-16 rounded-full bg-surface2 border-2 border-accent/30 flex items-center justify-center"
              animate={{
                scale: status === 'connected' ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: status === 'connected' ? Infinity : 0,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
                <motion.path
                  d="M3 2L8 14L13 2"
                  stroke="#663af3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{
                    opacity: status === 'connected' ? [0.6, 1, 0.6] : 0.8,
                  }}
                  transition={{
                    duration: 1,
                    repeat: status === 'connected' ? Infinity : 0,
                  }}
                />
                <motion.path
                  d="M5 8H11"
                  stroke="#663af3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{
                    opacity: status === 'connected' ? [0.6, 1, 0.6] : 0.8,
                  }}
                  transition={{
                    duration: 1,
                    repeat: status === 'connected' ? Infinity : 0,
                    delay: 0.2,
                  }}
                />
              </svg>
            </motion.div>
          </div>

          <span className="text-xs text-mist font-medium">{sourceLabel}</span>
        </div>
      </motion.div>

      {/* RIFT Seam in the center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RiftSeam isOpen={getSeamState()} width={120} height={4} />
      </div>

      {/* Destination endpoint */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: getEndpointOpacity(),
          x: status === 'approaching' || status === 'proximity' ? -20 : 0,
        }}
        transition={{ duration: TIMING.PROXIMITY_RESPONSE / 1000 }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* RIFT icon with magnetic field */}
          <div className="relative">
            {/* Magnetic field visualization */}
            {(status === 'proximity' || status === 'connected') && (
              <motion.div
                className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />
            )}

            {/* RIFT symbol */}
            <motion.div
              className="relative w-16 h-16 rounded-full bg-surface2 border-2 border-accent/30 flex items-center justify-center"
              animate={{
                scale: status === 'connected' ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: status === 'connected' ? Infinity : 0,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
                <motion.path
                  d="M3 2L8 14L13 2"
                  stroke="#663af3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{
                    opacity: status === 'connected' ? [0.6, 1, 0.6] : 0.8,
                  }}
                  transition={{
                    duration: 1,
                    repeat: status === 'connected' ? Infinity : 0,
                  }}
                />
                <motion.path
                  d="M5 8H11"
                  stroke="#663af3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{
                    opacity: status === 'connected' ? [0.6, 1, 0.6] : 0.8,
                  }}
                  transition={{
                    duration: 1,
                    repeat: status === 'connected' ? Infinity : 0,
                    delay: 0.2,
                  }}
                />
              </svg>
            </motion.div>

            {/* Thunder flash on completion */}
            <AnimatePresence>
              {status === 'complete' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ThunderFlash trigger={thunderTrigger} size="small" />
                </div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-xs text-mist font-medium">{destinationLabel}</span>
        </div>
      </motion.div>

      {/* Status text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-frost font-medium mb-1">
            {status === 'idle' && 'Ready to transfer'}
            {status === 'approaching' && 'Establishing connection...'}
            {status === 'proximity' && 'Endpoints detected'}
            {status === 'connected' && 'Connection established'}
            {status === 'seam_open' && 'Opening RIFT...'}
            {status === 'transferring' && `Transferring ${fileName || 'file'}...`}
            {status === 'reconstructing' && 'Reconstructing file...'}
            {status === 'complete' && 'Transfer complete'}
            {status === 'thunder_flash' && '✓'}
          </div>
          {status === 'transferring' && (
            <div className="text-xs text-fog">{Math.round(progress)}%</div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
