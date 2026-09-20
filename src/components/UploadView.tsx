import { motion } from 'framer-motion';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation, X, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
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

function getStatusIcon(status: string, progress: number) {
  if (status === 'READY') return <CheckCircle2 size={16} className="text-success" />;
  if (status === 'FAILED') return <AlertCircle size={16} className="text-error" />;
  if (status === 'UPLOADING') return <Loader2 size={16} className="text-violet-bright animate-spin" />;
  if (status === 'PROCESSING') return <Loader2 size={16} className="text-violet-bright animate-spin" />;
  return null;
}

export default function UploadView({ files, transfer, onCancel }: UploadViewProps) {
  const completedFiles = files.filter(f => f.status === 'READY').length;
  const totalProgress = files.length > 0 
    ? files.reduce((sum, f) => sum + f.progress, 0) / files.length 
    : 0;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const isComplete = completedFiles === files.length && files.length > 0;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="section-eyebrow mb-3">
            {isComplete ? 'Transfer Complete' : 'Uploading'}
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-frost tracking-tight">
            {isComplete ? 'Files secured' : 'Sending your files'}
          </h2>
          <p className="text-moon text-sm mt-2">
            {formatFileSize(totalSize)} • {files.length} file{files.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Overall Progress */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-moon">{completedFiles} of {files.length} files</span>
              <span className="text-sm text-frost font-medium">{Math.round(totalProgress)}%</span>
            </div>
            <div className="progress-bar h-2">
              <motion.div
                className="progress-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* File List */}
        <div className="glass-card-elevated rounded-2xl p-4 space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-1/30 border border-glass-border"
            >
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-frost truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-fog">{formatFileSize(file.size)}</span>
                  {file.status === 'UPLOADING' && (
                    <span className="text-xs text-violet-bright">{Math.round(file.progress)}%</span>
                  )}
                  {file.status === 'READY' && (
                    <span className="text-xs text-success">Complete</span>
                  )}
                  {file.status === 'FAILED' && (
                    <span className="text-xs text-error">Failed</span>
                  )}
                </div>
                
                {/* Individual progress bar */}
                {(file.status === 'UPLOADING' || file.status === 'PROCESSING') && (
                  <div className="progress-bar h-1 mt-2">
                    <motion.div
                      className="progress-fill h-full"
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                {getStatusIcon(file.status, file.progress)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cancel Button */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <button
              onClick={onCancel}
              className="btn-ghost text-sm"
            >
              Cancel Upload
            </button>
          </motion.div>
        )}

        {/* Success animation */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 border border-success/20 mb-4">
              <CheckCircle2 size={32} className="text-success" />
            </div>
            <p className="text-moon text-sm">Preparing your transfer link...</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
