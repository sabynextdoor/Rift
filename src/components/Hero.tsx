import { useCallback, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  const heroRef = useRef<HTMLElement>(null);

  // 3D scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const heroRotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);

  // Mouse parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
    >
      {/* 3D Ambient layers */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet/5 rounded-full blur-[150px] pointer-events-none"
        style={{
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-deep/3 rounded-full blur-[100px] pointer-events-none"
        style={{
          x: mousePos.x * -0.3,
          y: mousePos.y * -0.3,
        }}
      />

      {/* Conic halo */}
      <div className="absolute inset-0 bg-conic-halo opacity-30 pointer-events-none" />

      {/* 3D Floating orbs */}
      <motion.div
        className="absolute top-20 left-[15%] w-3 h-3 rounded-full bg-violet-bright/30 blur-[1px]"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-40 right-[20%] w-2 h-2 rounded-full bg-violet/40 blur-[1px]"
        animate={{
          y: [0, -15, 0],
          x: [0, -8, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 left-[25%] w-2 h-2 rounded-full bg-blueprint-blue/30 blur-[1px]"
        animate={{
          y: [0, -12, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Content with 3D scroll transform */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto text-center"
        style={{
          y: heroY,
          opacity: heroOpacity,
          scale: heroScale,
          rotateX: heroRotateX,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-eyebrow mb-8"
        >
          Secure File Transfers
        </motion.div>

        {/* Headline - Dala-inspired massive display */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.02] mb-8"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.span
            className="text-gradient block"
            style={{
              x: mousePos.x * 0.1,
              y: mousePos.y * 0.1,
            }}
          >
            Send files.
          </motion.span>
          <motion.span
            className="text-frost/70 block mt-1"
            style={{
              x: mousePos.x * 0.05,
              y: mousePos.y * 0.05,
            }}
          >
            Share a link.{' '}
            <span className="text-frost/30">Done.</span>
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-fog text-lg font-light max-w-lg mx-auto mb-14 leading-relaxed"
          style={{ fontWeight: 300 }}
        >
          Transfer files securely with expiring links, optional passwords, and download limits. No account required.
        </motion.p>

        {/* Upload Zone - 3D glass card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`upload-zone p-8 md:p-12 relative glass-card-3d ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
          }}
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
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -6, 0], rotateZ: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-violet/10 border border-violet/20 mb-8 glow-violet"
              >
                <Upload size={28} className="text-violet-bright" />
              </motion.div>

              <p className="text-frost text-xl font-medium mb-3">
                Drop files here
              </p>
              <p className="text-fog text-sm mb-8">
                or choose an option below
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary"
                >
                  Select Files
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => folderInputRef.current?.click()}
                  className="btn-ghost"
                >
                  Select Folder
                </motion.button>
              </div>

              <p className="text-ash text-xs mt-8">
                Up to 5GB per file • Multiple files supported • All types accepted
              </p>
            </div>
          ) : (
            <div className="text-left">
              {/* File List */}
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto pr-2">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20, rotateY: -5 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: 20, rotateY: 5, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-1/50 border border-glass-border group"
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
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5 text-fog hover:text-frost transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-glass-border">
                <div className="text-sm">
                  <span className="text-frost font-medium">{files.length} file{files.length > 1 ? 's' : ''}</span>
                  <span className="text-fog ml-2">• {formatFileSize(totalSize)}</span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-violet-bright hover:text-violet font-medium transition-colors"
                >
                  + Add more
                </button>
              </div>

              {/* Transfer Config Toggle */}
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center gap-2 text-sm text-moon hover:text-frost transition-colors mb-4"
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
                    initial={{ opacity: 0, height: 0, rotateX: -5 }}
                    animate={{ opacity: 1, height: 'auto', rotateX: 0 }}
                    exit={{ opacity: 0, height: 0, rotateX: -5 }}
                    className="overflow-hidden mb-6"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-1/30 border border-glass-border">
                      {/* Expiration */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs text-fog mb-2">
                          <Clock size={12} />
                          Expires in
                        </label>
                        <select
                          value={config.expiration}
                          onChange={(e) => onConfigChange({ ...config, expiration: e.target.value as ExpirationOption })}
                          className="input-field text-sm"
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
                          className="input-field text-sm"
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
                          className="input-field text-sm"
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
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full py-4 text-base"
              >
                Send {files.length} file{files.length > 1 ? 's' : ''}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Stats bar */}
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-8 mt-12 py-4"
          >
            {[
              { value: '5GB', label: 'Max file size' },
              { value: '∞', label: 'File types' },
              { value: '0', label: 'Accounts needed' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-display font-medium text-frost">{stat.value}</div>
                <div className="text-xs text-fog mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-6"
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
      </motion.div>

      {/* Scroll indicator */}
      {files.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-fog/40">Scroll to explore</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-fog/20">
              <path d="M8 4V20M8 20L2 14M8 20L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
