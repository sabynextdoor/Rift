import { motion } from 'framer-motion';
import { liquidGlass, getLiquidGlassCSS } from '../utils/liquidGlass';

interface LiquidGlassProps {
  children: React.ReactNode;
  variant?: 'default' | 'active' | 'processing';
  className?: string;
  animate?: boolean;
}

export default function LiquidGlass({ 
  children, 
  variant = 'default', 
  className = '',
  animate = false 
}: LiquidGlassProps) {
  const styles = getLiquidGlassCSS(variant);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...styles,
        borderRadius: '16px',
      }}
      initial={animate ? { opacity: 0, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{
        duration: liquidGlass.timing.form,
        ease: liquidGlass.easing.liquid as any,
      }}
    >
      {/* Internal highlight layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at 30% 20%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
