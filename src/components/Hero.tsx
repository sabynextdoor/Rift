import { useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, Film, Music, Archive, FileText, Table, Presentation, ChevronDown, Lock, Clock, Download } from 'lucide-react';
import { TransferFile, TransferConfig, ExpirationOption, DownloadLimit } from '../types';
import { formatFileSize } from '../utils/transfer';
import { motion as motionTokens, riftVariants } from '../utils/motion';
import { MultipleFilesDropAnimation } from './FileDropAnimation';

interface HeroProps {
  files: TransferFile[];
  config: TransferConfig;
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
  onConfigChange: (config: TransferConfig) => void;
  onStartUpload: () => void;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image size={16} className="text-blue-400" />;
  if (type.startsWith('video/')) return <Film size={16} className="text-purple-400" />;
  if (type.startsWith('audio/')) return <Music size={16} className="text-pink-400" />;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive size={16} className="text-yellow-400" />;
  if (type.includes('pdf')) return <FileText size={16} className="text-red-400" />;
  if (type.includes('word') || type.includes('document')) return <FileText size={16} className="text-blue-400" />;
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <Table size={16} className="text-green-400" />;
  if (type.includes('presentation') || type.includes('powerpoint')) return <Presentation size={16} className="text-orange-400" />;
  return <File size={16} className="text-text-tertiary" />;
}

export default function Hero({ files, config, onAddFiles, onRemoveFile, onConfigChange, onStartUpload }: HeroProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showDropAnimation, setShowDropAnimation] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  // Track mouse position for radial gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dropzoneRef.current) {
        const rect = dropzoneRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        dropzoneRef.current.style.setProperty('--mouse-x', `${x}%`);
        dropzoneRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    const dropzone = dropzoneRef.current;
    if (dropzone) {
      dropzone.addEventListener('mousemove', handleMouseMove);
      return () => dropzone.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setDroppedFiles(filesArray);
      setShowDropAnimation(true);
      
      // Wait for animation to complete before adding files
      setTimeout(() => {
        onAddFiles(e.dataTransfer.files);
        setShowDropAnimation(false);
        setDroppedFiles([]);
      }, motionTokens.slow * 1000);
    }
  }, [onAddFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  }, [onAddFiles]);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        {/* Logo & Tagline */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-accent-bright">
                <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-text-primary">
              RIFT
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-display text-text-primary mb-4"
          >
            Send files.
            <br />
            <span className="text-text-secondary">Share a link.</span>{' '}
            <span className="text-text-tertiary">Done.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-body-lg text-text-secondary max-w-lg mx-auto"
          >
            Fast, private, temporary. No account required.
          </motion.p>
        </div>

        {/* Drop Zone - Liquid Glass Surface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            ref={dropzoneRef}
            className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
              isDragOver ? 'scale-[1.02]' : ''
            }`}
            style={{
              background: isDragOver
                ? `
                  linear-gradient(
                    135deg,
                    rgba(10, 132, 255, 0.08) 0%,
                    rgba(255, 255, 255, 0.03) 100%
                  )
                `
                : `
                  linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.05) 0%,
                    rgba(255, 255, 255, 0.02) 100%
                  )
                `,
              backdropFilter: 'blur(40px)',
              border: isDragOver ? '1px solid rgba(10, 132, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: isDragOver
                ? `
                  inset 0 1px 1px rgba(10, 132, 255, 0.2),
                  0 20px 60px rgba(10, 132, 255, 0.15)
                `
                : `
                  inset 0 1px 1px rgba(255, 255, 255, 0.1),
                  0 20px 60px rgba(0, 0, 0, 0.3)
                `,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Liquid glass highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
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

            {/* Mouse-following highlight */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `
                  radial-gradient(
                    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                    rgba(10, 132, 255, 0.1) 0%,
                    transparent 50%
                  )
                `,
                opacity: isDragOver ? 1 : 0,
              }}
            />

            <div className="relative z-10 p-12">
            {/* Hidden inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select files"
            />
            <input
              ref={folderInputRef}
              type="file"
              multiple
              {...({ webkitdirectory: 'true', directory: 'true' } as any)}
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select folder"
            />

            {/* File Drop Animation Overlay */}
            <AnimatePresence>
              {showDropAnimation && droppedFiles.length > 0 && (
                <motion.div
                  className="absolute inset-0 z-20 flex items-center justify-center bg-void/80 backdrop-blur-sm rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionTokens.fast }}
                >
                  <MultipleFilesDropAnimation
                    files={droppedFiles}
                    onComplete={() => {}}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {files.length === 0 ? (
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6"
                >
                  <Upload size={28} className="text-accent-bright" />
                </motion.div>

                <p className="text-heading text-text-primary mb-2">
                  Drop files here
                </p>
                <p className="text-body text-text-secondary mb-6">
                  or choose an option below
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-primary"
                  >
                    Select Files
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => folderInputRef.current?.click()}
                    className="btn btn-secondary"
                  >
                    Select Folder
                  </motion.button>
                </div>

                <p className="text-caption text-text-tertiary mt-8">
                  Up to 5GB per file • Multiple files supported • All types accepted
                </p>
              </div>
            ) : (
              <div className="relative z-10 text-left">
                {/* File List */}
                <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-surface-2/50 border border-border group"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm text-text-primary truncate">{file.name}</p>
                          <p className="text-caption text-text-tertiary">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => onRemoveFile(file.id)}
                          className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/5 text-text-tertiary hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                  <div className="text-body-sm">
                    <span className="text-text-primary font-medium">{files.length} file{files.length > 1 ? 's' : ''}</span>
                    <span className="text-text-tertiary ml-2">• {formatFileSize(totalSize)}</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-caption text-accent-bright hover:text-accent font-medium transition-colors"
                  >
                    + Add more
                  </button>
                </div>

                {/* Transfer Config Toggle */}
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
                >
                  <span>Transfer settings</span>
                  <motion.div animate={{ rotate: showConfig ? 180 : 0 }}>
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                {/* Config Panel */}
                <AnimatePresence>
                  {showConfig && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-2/30 border border-border">
                        {/* Expiration */}
                        <div>
                          <label className="flex items-center gap-1.5 text-caption text-text-tertiary mb-2">
                            <Clock size={12} />
                            Expires in
                          </label>
                          <select
                            value={config.expiration}
                            onChange={(e) => onConfigChange({ ...config, expiration: e.target.value as ExpirationOption })}
                            className="input text-body-sm"
                          >
                            <option value="1h">1 hour</option>
                            <option value="24h">24 hours</option>
                            <option value="3d">3 days</option>
                            <option value="7d">7 days</option>
                          </select>
                        </div>

                        {/* Password */}
                        <div>
                          <label className="flex items-center gap-1.5 text-caption text-text-tertiary mb-2">
                            <Lock size={12} />
                            Password (optional)
                          </label>
                          <input
                            type="password"
                            value={config.password}
                            onChange={(e) => onConfigChange({ ...config, password: e.target.value })}
                            placeholder="Leave empty"
                            className="input text-body-sm"
                          />
                        </div>

                        {/* Download Limit */}
                        <div>
                          <label className="flex items-center gap-1.5 text-caption text-text-tertiary mb-2">
                            <Download size={12} />
                            Download limit
                          </label>
                          <select
                            value={config.downloadLimit}
                            onChange={(e) => onConfigChange({ ...config, downloadLimit: e.target.value as DownloadLimit })}
                            className="input text-body-sm"
                          >
                            <option value="unlimited">Unlimited</option>
                            <option value="1">1 download</option>
                            <option value="5">5 downloads</option>
                            <option value="10">10 downloads</option>
                            <option value="25">25 downloads</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Upload Button */}
                <motion.button
                  onClick={onStartUpload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary w-full py-4 text-body"
                >
                  Send {files.length} file{files.length > 1 ? 's' : ''}
                </motion.button>
              </div>
            )}
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12"
          >
            {[
              { icon: '🔒', text: 'End-to-end encrypted' },
              { icon: '⏱', text: 'Auto-expiring links' },
              { icon: '🛡', text: 'Malware scanned' },
              { icon: '⚡', text: 'No account needed' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-caption text-text-tertiary">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
