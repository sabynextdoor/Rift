import { motion } from 'framer-motion';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { TransferFile, Transfer } from '../types';
import { formatFileSize } from '../utils/transfer';
import LiquidProgress from './LiquidProgress';

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
  return <File size={18} className="text-text-tertiary" />;
}

function getStatusIcon(status: string) {
  if (status === 'READY') return <CheckCircle2 size={16} className="text-success" />;
  if (status === 'FAILED') return <AlertCircle size={16} className="text-error" />;
  if (status === 'UPLOADING' || status === 'PROCESSING') return <Loader2 size={16} className="text-accent-bright animate-spin" />;
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
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            {isComplete ? (
              <>
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-caption text-success font-medium">Transfer Complete</span>
              </>
            ) : (
              <>
                <Loader2 size={14} className="text-accent-bright animate-spin" />
                <span className="text-caption text-accent-bright font-medium">Uploading</span>
              </>
            )}
          </div>

          <h2 className="text-hero text-text-primary mb-3">
            {isComplete ? 'Files secured' : 'Sending your files'}
          </h2>
          <p className="text-body text-text-secondary">
            {formatFileSize(totalSize)} • {files.length} file{files.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Overall Progress - Liquid Glass */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-body-sm text-text-secondary">{completedFiles} of {files.length} files</span>
              <span className="text-body-sm text-text-primary font-medium">{Math.round(totalProgress)}%</span>
            </div>
            <LiquidProgress progress={totalProgress} />
          </motion.div>
        )}

        {/* File List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="card-elevated space-y-2"
        >
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-2/50 border border-border"
            >
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-text-primary truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-caption text-text-tertiary">{formatFileSize(file.size)}</span>
                  {file.status === 'UPLOADING' && (
                    <span className="text-caption text-accent-bright">{Math.round(file.progress)}%</span>
                  )}
                  {file.status === 'READY' && (
                    <span className="text-caption text-success">Complete</span>
                  )}
                  {file.status === 'FAILED' && (
                    <span className="text-caption text-error">Failed</span>
                  )}
                </div>

                {/* Individual progress bar */}
                {(file.status === 'UPLOADING' || file.status === 'PROCESSING') && (
                  <div className="progress h-1 mt-2">
                    <motion.div
                      className="progress-bar"
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                {getStatusIcon(file.status)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cancel Button */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="btn btn-ghost"
            >
              Cancel Upload
            </motion.button>
          </motion.div>
        )}

        {/* Success animation */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-center mt-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border border-accent/20 mb-4"
            >
              <CheckCircle2 size={36} className="text-accent-bright" />
            </motion.div>
            <p className="text-body text-text-secondary">Preparing your transfer link...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
