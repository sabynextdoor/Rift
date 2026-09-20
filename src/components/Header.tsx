import { motion } from 'framer-motion';
import { AppView } from '../types';

interface HeaderProps {
  view: AppView;
  onReset: () => void;
}

export default function Header({ view, onReset }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={onReset}
            className="flex items-center gap-2.5 group"
            aria-label="RIFT Home"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-violet/20 border border-violet/30 flex items-center justify-center group-hover:bg-violet/30 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-violet-bright">
                  <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="absolute inset-0 rounded-lg bg-violet/10 blur-md group-hover:bg-violet/20 transition-colors" />
            </div>
            <span className="text-lg font-display font-semibold tracking-tight text-frost">
              RIFT
            </span>
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-fill border border-glass-border">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-moon font-medium">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
