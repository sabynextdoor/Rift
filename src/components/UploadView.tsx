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
  if (status === 'READY') return <CheckCircle2 size={16} className="text-ok" />;
  if (status === 'FAILED') return <AlertCircle size={16} className="text-danger" />;
  if (status === 'UPLOADING' || status === 'PROCESSING') return <Loader2 size={16} className="text-accent animate-spin" />;
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
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-20">
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
                <CheckCircle2 size={14} className="text-ok" />
                <span className="text-xs text-ok font-medium">Transfer Complete</span>
              </>
            ) : (
              <>
                <Loader2 size={14} className="text-accent animate-spin" />
                <span className="text-xs text-accent font-medium">Uploading</span>
              </>
            )}
          </div>

          <h2 className="premium-display mb-3">
            {isComplete ? 'Files secured' : 'Sending your files'}
          </h2>
          <p className="premium-subtitle">
            {formatFileSize(totalSize)} • {files.length} file{files.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Overall Progress */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-mist">{completedFiles} of {files.length} files</span>
              <span className="text-sm text-frost font-medium">{Math.round(totalProgress)}%</span>
            </div>
            <div className="premium-progress-track">
              <motion.div
                className="premium-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* File List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="premium-panel-raised p-4 space-y-2"
        >
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface2/50 border border-hairline"
            >
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-frost truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-fog">{formatFileSize(file.size)}</span>
                  {file.status === 'UPLOADING' && (
                    <span className="text-xs text-accent">{Math.round(file.progress)}%</span>
                  )}
                  {file.status === 'READY' && (
                    <span className="text-xs text-ok">Complete</span>
                  )}
                  {file.status === 'FAILED' && (
                    <span className="text-xs text-danger">Failed</span>
                  )}
                </div>

                {/* Individual progress bar */}
                {(file.status === 'UPLOADING' || file.status === 'PROCESSING') && (
                  <div className="premium-progress-track h-1 mt-2">
                    <motion.div
                      className="premium-progress-fill"
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
              className="premium-button-ghost"
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <CheckCircle2 size={36} className="text-accent" />
            </div>
            <p className="text-sm text-mist">Preparing your transfer link...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
