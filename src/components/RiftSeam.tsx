import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RiftSeamProps {
  isOpen: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function RiftSeam({ isOpen, width = 200, height = 4, className = '' }: RiftSeamProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isAnimating && !isOpen) return null;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Base seam line */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isOpen ? 1 : 0,
          opacity: isOpen ? [0, 1, 0.8] : 0,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
      />

      {/* Dimensional split - the tear */}
      <motion.div
        className="absolute inset-0"
        initial={{ scaleY: 0 }}
        animate={{
          scaleY: isOpen ? [0, 2, 1] : 0,
        }}
        transition={{
          duration: 0.25,
          times: [0, 0.5, 1],
          ease: 'easeOut',
        }}
      >
        {/* Upper edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
          style={{
            boxShadow: '0 -2px 8px rgba(102, 58, 243, 0.4)',
          }}
        />

        {/* Lower edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
          style={{
            boxShadow: '0 2px 8px rgba(102, 58, 243, 0.4)',
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-0 bg-accent/20 blur-sm"
          style={{
            transform: 'scaleY(0.5)',
          }}
        />
      </motion.div>

      {/* Energy pulse traveling through seam */}
      {isOpen && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-2 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
          initial={{ x: -width, opacity: 0 }}
          animate={{
            x: width,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Subtle distortion effect */}
      <motion.div
        className="absolute inset-0 bg-accent/10 blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isOpen ? [0, 0.3, 0.2] : 0,
          scale: isOpen ? [0.8, 1.2, 1] : 0.8,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}

// Seam with particles flowing through
interface RiftSeamWithParticlesProps extends RiftSeamProps {
  particleFlow?: boolean;
}

export function RiftSeamWithParticles({ particleFlow = false, ...props }: RiftSeamWithParticlesProps) {
  return (
    <div className="relative">
      <RiftSeam {...props} />
      
      {particleFlow && props.isOpen && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Particle stream indicators */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent"
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: props.width || 200,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
