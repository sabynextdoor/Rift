import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { liquidGlass } from '../utils/liquidGlass';
import { X } from 'lucide-react';

interface QRAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function QRAnimation({ isOpen, onClose, url }: QRAnimationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{
                duration: liquidGlass.timing.transform,
                ease: liquidGlass.easing.liquid as any,
              }}
            >
              {/* Glass container */}
              <div
                className="relative p-8 rounded-3xl"
                style={{
                  background: `
                    linear-gradient(
                      135deg,
                      rgba(255, 255, 255, 0.08) 0%,
                      rgba(255, 255, 255, 0.03) 100%
                    )
                  `,
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `
                    inset 0 1px 1px rgba(255, 255, 255, 0.15),
                    0 20px 60px rgba(0, 0, 0, 0.5)
                  `,
                }}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>

                {/* Title */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Scan to Download
                  </h3>
                  <p className="text-sm text-white/60">
                    Point your camera at the QR code
                  </p>
                </motion.div>

                {/* QR Code with animation */}
                <div className="relative flex items-center justify-center mb-6">
                  {/* Fragmenting animation overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    {/* Fragments */}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-4 h-4 bg-white/20 rounded-sm"
                        initial={{
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                          rotate: Math.random() * 360,
                          opacity: 0,
                        }}
                        animate={{
                          x: 0,
                          y: 0,
                          rotate: 0,
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.02,
                          ease: liquidGlass.easing.liquid as any,
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* QR Code */}
                  <motion.div
                    className="relative p-4 bg-white rounded-2xl"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3,
                      ease: liquidGlass.easing.liquid as any,
                    }}
                  >
                    <QRCodeSVG
                      value={url}
                      size={200}
                      level="M"
                      includeMargin={false}
                    />

                    {/* Scan line animation */}
                    <motion.div
                      className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1,
                        delay: 0.7,
                        times: [0, 0.5, 1],
                      }}
                    >
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{
                          duration: 0.8,
                          delay: 0.7,
                          ease: 'linear',
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* URL display */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-xs text-white/40 font-mono break-all">
                    {url}
                  </div>
                </motion.div>

                {/* Internal highlight */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
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
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
