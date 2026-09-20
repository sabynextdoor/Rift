import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { motion as motionTokens } from '../utils/motion';

interface ProximityAnimationProps {
  active?: boolean;
  className?: string;
}

export default function ProximityAnimation({ active = false, className = '' }: ProximityAnimationProps) {
  const [distance, setDistance] = useState(100);

  // Simulate proximity states
  useEffect(() => {
    if (!active) {
      setDistance(100);
      return;
    }

    const interval = setInterval(() => {
      setDistance(prev => {
        if (prev > 20) return prev - 2;
        return 20;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [active]);

  const isConnected = distance < 20;
  const isConnecting = distance < 40 && distance >= 20;
  const isDetecting = distance < 70 && distance >= 40;

  return (
    <div className={`relative w-64 h-32 ${className}`}>
      {/* Node A - Sender */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2"
        animate={{
          scale: isDetecting ? 1.05 : 1,
          opacity: isDetecting ? 0.9 : 0.6,
        }}
        transition={{ duration: motionTokens.standard }}
      >
        <div className="relative">
          {/* Ambient pulse */}
          {isDetecting && (
            <motion.div
              className="absolute inset-0 rounded-full bg-accent/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
          
          {/* Node */}
          <div className="relative w-12 h-12 rounded-full bg-surface-2 border-2 border-accent/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
        </div>
      </motion.div>

      {/* Connection field */}
      <motion.div
        className="absolute top-1/2 left-20 right-20 -translate-y-1/2 h-px"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{
          opacity: isConnecting || isConnected ? 1 : 0,
          scaleX: isConnecting || isConnected ? 1 : 0,
        }}
        transition={{ duration: motionTokens.slow }}
      >
        <div className="relative h-full bg-gradient-to-r from-accent/50 via-accent to-accent/50">
          {/* Traveling pulse */}
          {isConnected && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-8 h-2 bg-accent rounded-full blur-sm"
              animate={{
                x: ['-100%', '400%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Node B - Receiver */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2"
        animate={{
          scale: isDetecting ? 1.05 : 1,
          opacity: isDetecting ? 0.9 : 0.6,
        }}
        transition={{ duration: motionTokens.standard }}
      >
        <div className="relative">
          {/* Ambient pulse */}
          {isDetecting && (
            <motion.div
              className="absolute inset-0 rounded-full bg-accent/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
              }}
            />
          )}
          
          {/* Node */}
          <div className="relative w-12 h-12 rounded-full bg-surface-2 border-2 border-accent/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>
        </div>
      </motion.div>

      {/* Status text */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-caption text-text-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: motionTokens.standard }}
      >
        {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : isDetecting ? 'Detecting...' : ''}
      </motion.div>
    </div>
  );
}
