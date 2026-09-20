import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, Share2, Trash2, Clock, Lock, Download, File, QrCode, CheckCircle2 } from 'lucide-react';
import { Transfer } from '../types';
import { formatFileSize, formatRelativeTime, getTransferUrl } from '../utils/transfer';

interface ReadyViewProps {
  transfer: Transfer | null;
  onNewTransfer: () => void;
}

export default function ReadyView({ transfer, onNewTransfer }: ReadyViewProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!transfer) return null;

  const transferUrl = getTransferUrl(transfer);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transferUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RIFT Transfer',
          text: `I'm sending you ${transfer.files.length} file${transfer.files.length > 1 ? 's' : ''} via RIFT`,
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
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial" />

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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <CheckCircle2 size={36} className="text-accent-bright" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
            <CheckCircle2 size={14} className="text-success" />
            <span className="text-caption text-success font-medium">RIFT Ready</span>
          </div>

          <h2 className="text-hero text-text-primary mb-3">
            Your files are ready to share
          </h2>
          <p className="text-body text-text-secondary">
            {transfer.files.length} file{transfer.files.length > 1 ? 's' : ''} • {formatFileSize(transfer.totalSize)}
          </p>
        </motion.div>

        {/* Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card-elevated mb-6"
        >
          <label className="text-caption text-text-tertiary font-medium uppercase tracking-wider mb-3 block">
            Transfer Link
          </label>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-2/50 border border-border">
            <input
              ref={inputRef}
              type="text"
              readOnly
              value={transferUrl}
              className="flex-1 bg-transparent text-body-sm text-text-primary font-mono truncate outline-none"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-body-sm font-medium transition-all ${
                copied
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'bg-accent/10 text-accent-bright border border-accent/20 hover:bg-accent/20'
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
                <span className="text-caption text-success flex items-center justify-center gap-1.5">
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
            className="flex flex-col items-center gap-2 p-4 rounded-xl card hover:bg-surface-2 transition-colors"
          >
            <Share2 size={20} className="text-text-primary" />
            <span className="text-caption text-text-secondary">Share</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQR(!showQR)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl card hover:bg-surface-2 transition-colors"
          >
            <QrCode size={20} className="text-text-primary" />
            <span className="text-caption text-text-secondary">QR Code</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreview}
            className="flex flex-col items-center gap-2 p-4 rounded-xl card hover:bg-surface-2 transition-colors"
          >
            <ExternalLink size={20} className="text-text-primary" />
            <span className="text-caption text-text-secondary">Preview</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewTransfer}
            className="flex flex-col items-center gap-2 p-4 rounded-xl card hover:bg-surface-2 transition-colors group"
          >
            <Trash2 size={20} className="text-text-primary group-hover:text-error transition-colors" />
            <span className="text-caption text-text-secondary">Delete</span>
          </motion.button>
        </motion.div>

        {/* QR Code */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="card-elevated mb-6 text-center"
            >
              <div className="inline-block p-4 bg-surface-2 rounded-xl mb-4">
                <QRCodeSVG
                  value={transferUrl}
                  size={180}
                  level="M"
                  bgColor="#101012"
                  fgColor="#F5F5F5"
                />
              </div>
              <p className="text-body-sm text-text-secondary">Scan to open transfer link</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transfer Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="card"
        >
          <h3 className="text-body-sm font-medium text-text-primary mb-5">Transfer Details</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-body-sm text-text-secondary">
                <Clock size={14} />
                Expires
              </span>
              <span className="text-body-sm text-text-primary font-medium">
                {formatRelativeTime(transfer.expiresAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-body-sm text-text-secondary">
                <Download size={14} />
                Downloads
              </span>
              <span className="text-body-sm text-text-primary font-medium">
                {transfer.config.downloadLimit === 'unlimited'
                  ? 'Unlimited'
                  : `${transfer.downloadCount} / ${transfer.config.downloadLimit}`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-body-sm text-text-secondary">
                <Lock size={14} />
                Password
              </span>
              <span className="text-body-sm text-text-primary font-medium">
                {transfer.config.password ? 'Protected' : 'None'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-body-sm text-text-secondary">
                <File size={14} />
                Files
              </span>
              <span className="text-body-sm text-text-primary font-medium">
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
            className="btn btn-secondary"
          >
            Send another transfer
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
