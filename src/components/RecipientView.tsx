import { useState } from 'react';
import { motion } from 'framer-motion';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation, Download, Lock, Shield, Clock, AlertTriangle } from 'lucide-react';
import { Transfer } from '../types';
import { formatFileSize, formatRelativeTime } from '../utils/transfer';

interface RecipientViewProps {
  transfer: Transfer | null;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image size={18} className="text-blue-400" />;
  if (type.startsWith('video/')) return <Film size={18} className="text-purple-400" />;
  if (type.startsWith('audio/')) return <Music size={18} className="text-pink-400" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive size={18} className="text-yellow-400" />;
  if (type.includes('pdf')) return <FileText size={18} className="text-red-400" />;
  if (type.includes('word') || type.includes('document')) return <FileText size={18} className="text-blue-400" />;
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <Table size={18} className="text-green-400" />;
  if (type.includes('presentation') || type.includes('powerpoint')) return <Presentation size={18} className="text-orange-400" />;
  return <File size={18} className="text-fog" />;
}

export default function RecipientView({ transfer }: RecipientViewProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!transfer?.config.password);
  const [passwordError, setPasswordError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  if (!transfer) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 border border-error/20 mb-6">
            <AlertTriangle size={28} className="text-error" />
          </div>
          <h2 className="font-display text-2xl font-medium text-frost mb-2">Transfer Not Found</h2>
          <p className="text-moon text-sm">This transfer may have expired or been deleted.</p>
        </div>
      </section>
    );
  }

  // Check if expired
  const isExpired = new Date() > transfer.expiresAt;
  if (isExpired) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 border border-warning/20 mb-6">
            <Clock size={28} className="text-warning" />
          </div>
          <h2 className="font-display text-2xl font-medium text-frost mb-2">Transfer Expired</h2>
          <p className="text-moon text-sm">This transfer has expired and is no longer available.</p>
        </div>
      </section>
    );
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === transfer.config.password) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleDownload = (fileId: string) => {
    setDownloading(fileId);
    // Simulate download
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  const handleDownloadAll = () => {
    setDownloading('all');
    setTimeout(() => {
      setDownloading(null);
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet/10 border border-violet/20 mb-6">
              <Lock size={24} className="text-violet-bright" />
            </div>
            
            <h2 className="font-display text-xl font-medium text-frost mb-2">
              Password Required
            </h2>
            <p className="text-moon text-sm mb-6">
              This transfer is password protected. Enter the password to access the files.
            </p>
            
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="input-field mb-3 text-center"
                autoFocus
              />
              {passwordError && (
                <p className="text-error text-xs mb-3">{passwordError}</p>
              )}
              <button type="submit" className="btn-primary w-full">
                Unlock Transfer
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
            <Shield size={12} className="text-success" />
            <span className="text-xs text-success font-medium">Verified Transfer</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-medium text-frost tracking-tight mb-2">
            Files ready for download
          </h2>
          <p className="text-moon text-sm">
            {transfer.files.length} file{transfer.files.length > 1 ? 's' : ''} • {formatFileSize(transfer.totalSize)} • Expires {formatRelativeTime(transfer.expiresAt)}
          </p>
        </motion.div>

        {/* File List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-elevated rounded-2xl p-4 mb-6"
        >
          <div className="space-y-2">
            {transfer.files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-1/30 border border-glass-border group"
              >
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-frost truncate">{file.name}</p>
                  <p className="text-xs text-fog">{formatFileSize(file.size)}</p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(file.id)}
                  disabled={downloading !== null}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-violet/10 border border-violet/20 text-violet-bright text-sm font-medium hover:bg-violet/20 transition-colors disabled:opacity-50"
                >
                  {downloading === file.id ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Download size={14} />
                    </motion.div>
                  ) : (
                    <Download size={14} />
                  )}
                  <span className="hidden sm:inline">Download</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Download All */}
        {transfer.files.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadAll}
              disabled={downloading !== null}
              className="btn-primary inline-flex items-center gap-2"
            >
              {downloading === 'all' ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Download size={16} />
                  </motion.div>
                  Creating ZIP...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download All as ZIP
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-fog flex items-center justify-center gap-1.5">
            <Shield size={12} />
            This transfer is scanned for malware and expires automatically
          </p>
        </motion.div>
      </div>
    </section>
  );
}
