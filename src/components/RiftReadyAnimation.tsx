import { motion } from 'framer-motion';
import { motion as motionTokens, riftVariants } from '../utils/motion';
import { CheckCircle2 } from 'lucide-react';

interface RiftReadyAnimationProps {
  fileName?: string;
  fileCount?: number;
}

export default function RiftReadyAnimation({ fileName, fileCount }: RiftReadyAnimationProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center"
      variants={riftVariants.ready}
      initial="initial"
      animate="resolve"
    >
      {/* Converging particles */}
      <div className="relative w-32 h-32">
        {/* Particle 1 */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent"
          initial={{ y: -40, opacity: 0 }}
          animate={{
            y: [-40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: motionTokens.slow,
            times: [0, 0.6, 1],
          }}
        />

        {/* Particle 2 */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent"
          initial={{ y: 40, opacity: 0 }}
          animate={{
            y: [40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: motionTokens.slow,
            delay: 0.1,
            times: [0, 0.6, 1],
          }}
        />

        {/* Particle 3 */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent"
          initial={{ x: -40, opacity: 0 }}
          animate={{
            x: [-40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: motionTokens.slow,
            delay: 0.2,
            times: [0, 0.6, 1],
          }}
        />

        {/* Particle 4 */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent"
          initial={{ x: 40, opacity: 0 }}
          animate={{
            x: [40, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: motionTokens.slow,
            delay: 0.3,
            times: [0, 0.6, 1],
          }}
        />

        {/* Central RIFT mark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: motionTokens.brand,
            delay: motionTokens.slow,
            ease: [0.34, 1.56, 0.64, 1], // Spring-like
          }}
        >
          <div className="relative">
            {/* Glow */}
            <motion.div
              className="absolute inset-0 bg-accent/30 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Icon */}
            <div className="relative w-20 h-20 rounded-full bg-surface-2 border-2 border-accent flex items-center justify-center">
              <CheckCircle2 size={40} className="text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Text */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: motionTokens.slow,
          delay: motionTokens.brand,
        }}
      >
        <div className="text-heading text-text-primary mb-2">
          RIFT Ready
        </div>
        {fileName && (
          <div className="text-body-sm text-text-secondary">
            {fileCount && fileCount > 1 ? `${fileCount} files` : fileName}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
