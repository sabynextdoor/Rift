import { motion } from 'framer-motion';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { TransferFile, Transfer } from '../types';
import { formatFileSize } from '../utils/transfer';

interface UploadViewProps {
  files: TransferFile[];
  transfer: Transfer | null;
  onCancel: () => void;
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

function getStatusIcon(status: string) {
  if (status === 'READY') return <CheckCircle2 size={16} className="text-success" />;
  if (status === 'FAILED') return <AlertCircle size={16} className="text-error" />;
  if (status === 'UPLOADING' || status === 'PROCESSING') return <Loader2 size={16} className="text-violet-bright animate-spin" />;
  return null;
}

export default function UploadView({ files, onCancel }: UploadViewProps) {
  const completedFiles = files.filter(f => f.status === 'READY').length;
  const totalProgress = files.length > 0
    ? files.reduce((sum, f) => sum + f.progress, 0) / files.length
    : 0;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const isComplete = completedFiles === files.length && files.length > 0;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="section-eyebrow mb-4">
            {isComplete ? 'Transfer Complete' : 'Uploading'}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-frost tracking-tight">
            {isComplete ? 'Files secured' : 'Sending your files'}
          </h2>
          <p className="text-moon text-sm mt-3">
            {formatFileSize(totalSize)} • {files.length} file{files.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-moon">{completedFiles} of {files.length} files</span>
              <span className="text-sm text-frost font-medium">{Math.round(totalProgress)}%</span>
            </div>
            <div className="progress-bar h-2.5">
              <motion.div
                className="progress-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card-elevated rounded-2xl p-4 space-y-2"
        >
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-1/30 border border-glass-border"
            >
              <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-frost truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-fog">{formatFileSize(file.size)}</span>
                  {file.status === 'UPLOADING' && <span className="text-xs text-violet-bright">{Math.round(file.progress)}%</span>}
                  {file.status === 'READY' && <span className="text-xs text-success">Complete</span>}
                  {file.status === 'FAILED' && <span className="text-xs text-error">Failed</span>}
                </div>
                {(file.status === 'UPLOADING' || file.status === 'PROCESSING') && (
                  <div className="progress-bar h-1 mt-2">
                    <motion.div className="progress-fill h-full" animate={{ width: `${file.progress}%` }} transition={{ duration: 0.2 }} />
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>
            </motion.div>
          ))}
        </motion.div>

        {!isComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center mt-6">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onCancel} className="btn-ghost text-sm">
              Cancel Upload
            </motion.button>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-violet/10 border border-violet/20 mb-4">
              <CheckCircle2 size={36} className="text-violet-bright" />
            </div>
            <p className="text-moon text-sm">Preparing your transfer link...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
