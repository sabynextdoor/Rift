import { motion, useScroll, useTransform } from 'framer-motion';
import { AppView } from '../types';
import { useRiftWink } from '../hooks/useRiftWink';
import { RiftWink } from './RiftWink';

interface HeaderProps {
  view: AppView;
  onReset: () => void;
}

export default function Header({ view, onReset }: HeaderProps) {
  const { scrollY } = useScroll();
  const { shouldWink, triggerWink } = useRiftWink();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(5, 6, 15, 0)', 'rgba(5, 6, 15, 0.8)']);
  const headerBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(20px)']);
  const headerBorder = useTransform(scrollY, [0, 100], ['rgba(186, 215, 247, 0)', 'rgba(186, 215, 247, 0.12)']);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 py-4"
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
            onClick={() => {
              onReset();
              triggerWink();
            }}
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Rift by Saby Home"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <RiftWink trigger={shouldWink} size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium tracking-tight text-ice font-display leading-none">
                Rift
              </span>
              <span className="text-[10px] text-fog font-medium tracking-wider leading-none">
                by Saby
              </span>
            </div>
          </motion.button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {view === 'landing' && (
              <>
                <a href="#features" className="premium-button-ghost text-xs">Features</a>
                <a href="#security" className="premium-button-ghost text-xs">Security</a>
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
                className="premium-button-secondary text-xs"
              >
                New Transfer
              </motion.button>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface2/50 border border-hairline"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              <span className="text-xs text-mist font-medium">Secure</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
