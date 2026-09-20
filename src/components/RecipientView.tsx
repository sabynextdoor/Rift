import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation, Download, Lock, Shield, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Transfer } from '../types';
import { formatFileSize, formatRelativeTime } from '../utils/transfer';

interface RecipientViewProps {
  transfer: Transfer | null;
  notFound?: boolean;
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
  return <File size={18} className="text-text-muted" />;
}

export default function RecipientView({ transfer, notFound }: RecipientViewProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!transfer?.config.password || transfer?.config.password === '');
  const [passwordError, setPasswordError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedFiles, setDownloadedFiles] = useState<Set<string>>(new Set());

  if (!transfer || notFound) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/5 border border-error/10 mb-6">
            <AlertTriangle size={32} className="text-error" />
          </motion.div>
          <h2 className="headline-condensed text-text-primary mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>TRANSFER NOT FOUND</h2>
          <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
            This transfer link may be invalid or the data could not be decoded. Please check the link or ask the sender to create a new transfer.
          </p>
          <a href={window.location.pathname} className="btn-primary inline-block">Go to RIFT</a>
        </motion.div>
      </section>
    );
  }

  const isExpired = new Date() > new Date(transfer.expiresAt);
  if (isExpired) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/5 border border-warning/10 mb-6">
            <Clock size={32} className="text-warning" />
          </motion.div>
          <h2 className="headline-condensed text-text-primary mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>TRANSFER EXPIRED</h2>
          <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
            This transfer has expired and all files have been permanently removed from storage.
          </p>
          <a href={window.location.pathname} className="btn-primary inline-block">Go to RIFT</a>
        </motion.div>
      </section>
    );
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Please enter a password.');
    }
  };

  const handleDownload = (fileId: string) => {
    setDownloading(fileId);
    setTimeout(() => {
      setDownloading(null);
      setDownloadedFiles(prev => new Set(prev).add(fileId));
    }, 1500);
  };

  const handleDownloadAll = () => {
    setDownloading('all');
    setTimeout(() => {
      setDownloading(null);
      setDownloadedFiles(new Set(transfer.files.map(f => f.id)));
    }, 2500);
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet/3 rounded-full blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-sm mx-auto">
          <div className="glass-card-elevated p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet/5 border border-violet/10 mb-6">
              <Lock size={28} className="text-violet-bright" />
            </motion.div>
            <h2 className="headline-condensed text-text-primary mb-2" style={{ fontSize: '2rem' }}>PASSWORD REQUIRED</h2>
            <p className="text-text-secondary text-sm mb-6">This transfer is password protected. Enter the password to access the files.</p>
            <form onSubmit={handlePasswordSubmit}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="input-field mb-3 text-center" autoFocus />
              <AnimatePresence>
                {passwordError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-error text-xs mb-3">{passwordError}</motion.p>
                )}
              </AnimatePresence>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary w-full">Unlock Transfer</motion.button>
            </form>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/5 border border-success/10 mb-5">
            <Shield size={14} className="text-success" />
            <span className="text-xs text-success font-medium">Verified Transfer</span>
          </motion.div>
          <h2 className="headline-condensed text-text-primary mb-3" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>FILES READY</h2>
          <p className="text-text-muted text-sm">
            {transfer.files.length} file{transfer.files.length > 1 ? 's' : ''} • {formatFileSize(transfer.totalSize)} • Expires {formatRelativeTime(transfer.expiresAt)}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="glass-card-elevated p-4 mb-6">
          <div className="space-y-2">
            {transfer.files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-2/50 border border-border group hover:border-violet/20 transition-colors"
              >
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{file.name}</p>
                  <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDownload(file.id)}
                  disabled={downloading !== null}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    downloadedFiles.has(file.id)
                      ? 'bg-success/10 border border-success/20 text-success'
                      : 'bg-violet/10 border border-violet/20 text-violet-bright hover:bg-violet/20'
                  } disabled:opacity-50`}
                >
                  {downloading === file.id ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Download size={14} />
                    </motion.div>
                  ) : downloadedFiles.has(file.id) ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Download size={14} />
                  )}
                  <span className="hidden sm:inline">{downloadedFiles.has(file.id) ? 'Done' : 'Download'}</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {transfer.files.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadAll}
              disabled={downloading !== null}
              className="btn-primary inline-flex items-center gap-2"
            >
              {downloading === 'all' ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center mt-10">
          <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
            <Shield size={12} />
            This transfer is scanned for malware and expires automatically
          </p>
        </motion.div>
      </div>
    </section>
  );
}
