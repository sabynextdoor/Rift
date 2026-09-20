import { motion, AnimatePresence } from 'framer-motion';
import { motion as motionTokens } from '../utils/motion';

interface RiftTransitionProps {
  active: boolean;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export default function RiftTransition({ active, onComplete, children }: RiftTransitionProps) {
  return (
    <div className="relative">
      {/* The RIFT seam - signature effect */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.fast }}
          >
            {/* The seam opening */}
            <motion.div
              className="relative w-full h-1 bg-accent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: motionTokens.brand,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut',
              }}
              onAnimationComplete={onComplete}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-accent blur-md"
                animate={{
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: motionTokens.brand,
                  times: [0, 0.3, 0.7, 1],
                }}
              />

              {/* Traveling particle through the rift */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg shadow-accent"
                initial={{ x: '-100%', scale: 0 }}
                animate={{
                  x: ['0%', '100%'],
                  scale: [0, 1, 1, 0],
                }}
                transition={{
                  duration: motionTokens.brand * 0.6,
                  delay: motionTokens.brand * 0.2,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {children}
    </div>
  );
}
