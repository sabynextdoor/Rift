import { motion } from 'framer-motion';
import { liquidGlass } from '../utils/liquidGlass';

interface LiquidProgressProps {
  progress: number; // 0-100
  speed?: string;
  className?: string;
}

export default function LiquidProgress({ progress, speed, className = '' }: LiquidProgressProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Progress container */}
      <div
        className="relative h-16 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Liquid fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            background: `
              linear-gradient(
                to top,
                rgba(10, 132, 255, 0.4) 0%,
                rgba(10, 132, 255, 0.2) 50%,
                rgba(10, 132, 255, 0.1) 100%
              )
            `,
            backdropFilter: 'blur(10px)',
          }}
          initial={{ height: '0%' }}
          animate={{ height: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: liquidGlass.easing.liquid as any,
          }}
        >
          {/* Liquid surface wave */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-2"
            style={{
              background: 'rgba(10, 132, 255, 0.3)',
              filter: 'blur(2px)',
            }}
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Internal light reflection */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  ellipse at 30% 50%,
                  rgba(255, 255, 255, 0.2) 0%,
                  transparent 50%
                )
              `,
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Progress text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(progress)}%
            </div>
            {speed && (
              <div className="text-xs text-white/60 mt-1">
                {speed}
              </div>
            )}
          </div>
        </div>

        {/* Glass highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%
              )
            `,
          }}
        />
      </div>
    </div>
  );
}
