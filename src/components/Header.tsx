import { motion, useScroll, useTransform } from 'framer-motion';
import { AppView } from '../types';

interface HeaderProps {
  view: AppView;
  onReset: () => void;
}

export default function Header({ view, onReset }: HeaderProps) {
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(5, 5, 5, 0)', 'rgba(5, 5, 5, 0.8)']);
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);
  const headerBorder = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.08)']);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        className="mx-auto max-w-7xl px-6 py-4"
        style={{
          backgroundColor: headerBg,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
          borderBottom: '1px solid',
          borderBottomColor: headerBorder,
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
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent-bright">
                <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              RIFT
            </span>
          </motion.button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {view === 'landing' && (
              <>
                <a href="#features" className="btn btn-ghost text-caption">Features</a>
                <a href="#security" className="btn btn-ghost text-caption">Security</a>
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
                className="btn btn-secondary text-caption"
              >
                New Transfer
              </motion.button>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2/50 border border-border"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-caption text-text-secondary font-medium">Secure</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
