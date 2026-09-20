import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink, Share2, Trash2, Clock, Lock, Download, File, QrCode, CheckCircle2 } from 'lucide-react';
import { Transfer } from '../types';
import { formatFileSize, formatRelativeTime, getTransferUrl } from '../utils/transfer';
import ThunderFlash from './ThunderFlash';
import QRAnimation from './QRAnimation';
import { useThunderFlash } from '../hooks/useThunderFlash';
import { useRiftWink } from '../hooks/useRiftWink';

interface ReadyViewProps {
  transfer: Transfer | null;
  onNewTransfer: () => void;
}

export default function ReadyView({ transfer, onNewTransfer }: ReadyViewProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { trigger: thunderTrigger, flash: triggerThunder } = useThunderFlash();
  const { triggerWink } = useRiftWink();

  // Trigger thunder flash when transfer is ready
  useEffect(() => {
    if (transfer) {
      const timer = setTimeout(() => {
        triggerThunder();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transfer, triggerThunder]);

  if (!transfer) return null;

  const transferUrl = getTransferUrl(transfer);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transferUrl);
      setCopied(true);
      triggerThunder(); // Micro thunder flash on copy
      triggerWink(); // Random wink animation
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        triggerThunder(); // Micro thunder flash on copy
        triggerWink(); // Random wink animation
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rift by Saby Transfer',
          text: `I'm sending you ${transfer.files.length} file${transfer.files.length > 1 ? 's' : ''} via Rift by Saby`,
          url: transferUrl,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handlePreview = () => {
    window.open(transferUrl, '_blank');
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-20">
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border border-accent/20 mb-6 relative"
          >
            <CheckCircle2 size={36} className="text-accent" />
            {/* Thunder flash on transfer complete */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ThunderFlash trigger={thunderTrigger} size="normal" />
            </div>
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ok/10 border border-ok/20 mb-4">
            <CheckCircle2 size={14} className="text-ok" />
            <span className="text-xs text-ok font-medium">Rift Ready</span>
          </div>

          <h2 className="premium-display mb-3">
            Your files are ready to share
          </h2>
          <p className="premium-subtitle">
            {transfer.files.length} file{transfer.files.length > 1 ? 's' : ''} • {formatFileSize(transfer.totalSize)}
          </p>
        </motion.div>

        {/* Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="premium-panel-raised p-6 mb-6"
        >
          <label className="text-xs text-fog font-medium uppercase tracking-wider mb-3 block">
            Transfer Link
          </label>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface2/50 border border-hairline">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={transferUrl}
              className="flex-1 bg-transparent text-sm text-frost font-mono truncate outline-none"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-ok/10 text-ok border border-ok/20'
                  : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={14} />
                    <span>Copied!</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Success toast */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 text-center"
              >
                <span className="text-xs text-ok flex items-center justify-center gap-1.5">
                  <Check size={12} />
                  Link copied to clipboard
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="premium-panel p-4 flex flex-col items-center gap-2 premium-card-hover"
          >
            <Share2 size={20} className="text-frost" />
            <span className="text-xs text-mist">Share</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQR(!showQR)}
            className="premium-panel p-4 flex flex-col items-center gap-2 premium-card-hover"
          >
            <QrCode size={20} className="text-frost" />
            <span className="text-xs text-mist">QR Code</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreview}
            className="premium-panel p-4 flex flex-col items-center gap-2 premium-card-hover"
          >
            <ExternalLink size={20} className="text-frost" />
            <span className="text-xs text-mist">Preview</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewTransfer}
            className="premium-panel p-4 flex flex-col items-center gap-2 premium-card-hover group"
          >
            <Trash2 size={20} className="text-frost group-hover:text-danger transition-colors" />
            <span className="text-xs text-mist">Delete</span>
          </motion.button>
        </motion.div>

        {/* QR Code */}
        <QRAnimation
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          url={transferUrl}
        />

        {/* Transfer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="premium-panel p-6"
        >
          <h3 className="text-sm font-medium text-frost mb-5">Transfer Details</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-fog">
                <Clock size={14} />
                Expires
              </span>
              <span className="text-sm text-frost font-medium">
                {formatRelativeTime(transfer.expiresAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-fog">
                <Download size={14} />
                Downloads
              </span>
              <span className="text-sm text-frost font-medium">
                {transfer.config.downloadLimit === 'unlimited'
                  ? 'Unlimited'
                  : `${transfer.downloadCount} / ${transfer.config.downloadLimit}`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-fog">
                <Lock size={14} />
                Password
              </span>
              <span className="text-sm text-frost font-medium">
                {transfer.config.password ? 'Protected' : 'None'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-fog">
                <File size={14} />
                Files
              </span>
              <span className="text-sm text-frost font-medium">
                {transfer.files.length} file{transfer.files.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </motion.div>

        {/* New Transfer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewTransfer}
            className="premium-button-secondary"
          >
            Send another transfer
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
