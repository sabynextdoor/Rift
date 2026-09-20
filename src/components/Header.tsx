import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { AppView } from '../types';

interface HeaderProps {
  view: AppView;
  onReset: () => void;
}

export default function Header({ view, onReset }: HeaderProps) {
  const { scrollY } = useScroll();
  const headerBg = useSpring(useTransform(scrollY, [0, 100], [0, 0.9]), { stiffness: 100, damping: 30 });
  const headerBlur = useSpring(useTransform(scrollY, [0, 100], [0, 20]), { stiffness: 100, damping: 30 });
  const headerBorderOpacity = useSpring(useTransform(scrollY, [0, 100], [0, 1]), { stiffness: 100, damping: 30 });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        className="mx-auto max-w-7xl px-6 py-4"
        style={{
          backgroundColor: useTransform(headerBg, (v) => `rgba(0, 0, 0, ${v})`),
          backdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          WebkitBackdropFilter: useTransform(headerBlur, (v) => `blur(${v}px)`),
          borderBottomWidth: '1px',
          borderBottomColor: useTransform(headerBorderOpacity, (v) => `rgba(255, 255, 255, ${v * 0.06})`),
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={onReset}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="RIFT Home"
          >
            <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="headline-compressed text-lg text-white tracking-wider">
              RIFT
            </span>
          </motion.button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {view === 'landing' && (
              <>
                <a href="#features" className="btn-ghost text-xs py-2 px-4">Features</a>
                <a href="#security" className="btn-ghost text-xs py-2 px-4">Security</a>
              </>
            )}
          </nav>

          {/* Status */}
          <div className="flex items-center gap-3">
            {view !== 'landing' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onReset}
                className="btn-ghost text-xs py-2 px-4"
              >
                New Transfer
              </motion.button>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-white/60 font-medium">Secure</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
