import { useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, Film, Music, Archive, FileText, Table, Presentation, ChevronDown, Lock, Clock, Download } from 'lucide-react';
import { TransferFile, TransferConfig, ExpirationOption, DownloadLimit } from '../types';
import { formatFileSize } from '../utils/transfer';

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
  return <File size={16} className="text-fog" />;
}

export default function Hero({ files, config, onAddFiles, onRemoveFile, onConfigChange, onStartUpload }: HeroProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

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
      onAddFiles(e.dataTransfer.files);
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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-20">
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
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-accent">
                <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-medium tracking-tight text-ice font-display leading-none">
                Rift
              </span>
              <span className="text-xs text-fog font-medium tracking-wider leading-none mt-0.5">
                by Saby
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="premium-display mb-4"
          >
            Send files.
            <br />
            <span className="text-frost/80">Share a link.</span>{' '}
            <span className="text-frost/50">Done.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="premium-subtitle max-w-lg mx-auto"
          >
            Fast, private, temporary. No account required.
          </motion.p>
        </div>

        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            ref={dropzoneRef}
            className={`premium-upload ${isDragOver ? 'border-accent/50 bg-accent-soft/40' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
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

            {files.length === 0 ? (
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6"
                >
                  <Upload size={28} className="text-accent" />
                </motion.div>

                <p className="premium-section-title mb-2">
                  Drop files here
                </p>
                <p className="premium-subtitle mb-6">
                  or choose an option below
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="premium-button-primary"
                  >
                    Select Files
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => folderInputRef.current?.click()}
                    className="premium-button-secondary"
                  >
                    Select Folder
                  </motion.button>
                </div>

                <p className="text-xs text-fog/70 mt-8">
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
                        className="flex items-center gap-3 p-3 rounded-lg bg-surface2/50 border border-hairline group"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-frost truncate">{file.name}</p>
                          <p className="text-xs text-fog">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => onRemoveFile(file.id)}
                          className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/5 text-fog hover:text-frost transition-colors opacity-0 group-hover:opacity-100"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-hairline">
                  <div className="text-sm">
                    <span className="text-frost font-medium">{files.length} file{files.length > 1 ? 's' : ''}</span>
                    <span className="text-fog ml-2">• {formatFileSize(totalSize)}</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-accent hover:text-ice font-medium transition-colors"
                  >
                    + Add more
                  </button>
                </div>

                {/* Transfer Config Toggle */}
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="flex items-center gap-2 text-sm text-mist hover:text-ice transition-colors mb-4"
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface2/30 border border-hairline">
                        {/* Expiration */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs text-fog mb-2">
                            <Clock size={12} />
                            Expires in
                          </label>
                          <select
                            value={config.expiration}
                            onChange={(e) => onConfigChange({ ...config, expiration: e.target.value as ExpirationOption })}
                            className="premium-input text-sm"
                          >
                            <option value="1h">1 hour</option>
                            <option value="24h">24 hours</option>
                            <option value="3d">3 days</option>
                            <option value="7d">7 days</option>
                          </select>
                        </div>

                        {/* Password */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs text-fog mb-2">
                            <Lock size={12} />
                            Password (optional)
                          </label>
                          <input
                            type="password"
                            value={config.password}
                            onChange={(e) => onConfigChange({ ...config, password: e.target.value })}
                            placeholder="Leave empty"
                            className="premium-input text-sm"
                          />
                        </div>

                        {/* Download Limit */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs text-fog mb-2">
                            <Download size={12} />
                            Download limit
                          </label>
                          <select
                            value={config.downloadLimit}
                            onChange={(e) => onConfigChange({ ...config, downloadLimit: e.target.value as DownloadLimit })}
                            className="premium-input text-sm"
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
                  className="premium-button-primary w-full py-4 text-base"
                >
                  Send {files.length} file{files.length > 1 ? 's' : ''}
                </motion.button>
              </div>
            )}
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
              <div key={i} className="flex items-center gap-2 text-xs text-fog">
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
