import { motion } from 'framer-motion';
import { liquidGlass } from '../utils/liquidGlass';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        {/* Initial droplet */}
        <motion.div
          className="relative w-20 h-20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 0.6,
            times: [0, 0.6, 1],
            ease: liquidGlass.easing.liquid as any,
          }}
        >
          {/* Glass droplet */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(
                  ellipse at 30% 30%,
                  rgba(255, 255, 255, 0.15) 0%,
                  rgba(10, 132, 255, 0.1) 50%,
                  rgba(255, 255, 255, 0.05) 100%
                )
              `,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: `
                inset 0 2px 4px rgba(255, 255, 255, 0.15),
                0 8px 32px rgba(0, 0, 0, 0.3)
              `,
            }}
            animate={{
              scaleX: [1, 1.5, 1],
            }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: liquidGlass.easing.surface as any,
            }}
          />

          {/* Internal light traveling */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              times: [0, 0.5, 1],
            }}
          >
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/30 blur-sm"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Split animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.2,
            delay: 1.4,
            times: [0, 0.2, 0.8, 1],
          }}
        >
          {/* Left half */}
          <motion.div
            className="absolute w-10 h-20 rounded-l-full"
            style={{
              background: 'rgba(10, 132, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              x: [0, -20, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 1.4,
              times: [0, 0.5, 1],
              ease: liquidGlass.easing.liquid as any,
            }}
          />

          {/* Right half */}
          <motion.div
            className="absolute w-10 h-20 rounded-r-full"
            style={{
              background: 'rgba(10, 132, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            animate={{
              x: [0, 20, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 1.4,
              times: [0, 0.5, 1],
              ease: liquidGlass.easing.liquid as any,
            }}
          />
        </motion.div>

        {/* RIFT logo reveal */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0, 0, 1],
            scale: [0.8, 0.8, 1],
          }}
          transition={{
            duration: 1.2,
            delay: 1.4,
            times: [0, 0.7, 1],
            ease: liquidGlass.easing.liquid as any,
          }}
          onAnimationComplete={onComplete}
        >
          <div className="text-4xl font-bold text-white tracking-tight">
            Rift
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
