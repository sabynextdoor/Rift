import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { AppView, TransferFile, TransferConfig, Transfer } from './types';
import { generateFileId, validateFile, simulateUpload, createTransfer, storeTransfer, decodeTransferFromUrl, encodeTransferForUrl } from './utils/transfer';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadView from './components/UploadView';
import ReadyView from './components/ReadyView';
import RecipientView from './components/RecipientView';
import Features from './components/Features';
import Footer from './components/Footer';
import ParticleField from './components/ParticleField';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [files, setFiles] = useState<TransferFile[]>([]);
  const [config, setConfig] = useState<TransferConfig>({
    expiration: '24h',
    password: '',
    downloadLimit: 'unlimited',
  });
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [recipientTransfer, setRecipientTransfer] = useState<Transfer | null>(null);
  const [transferNotFound, setTransferNotFound] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for progress bar
  const { scrollYProgress } = useScroll();

  // Check URL for recipient mode on mount AND on popstate
  useEffect(() => {
    const checkUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const transferId = params.get('t');
      const encodedData = params.get('d');

      console.log('Checking URL:', { transferId, encodedData: encodedData?.substring(0, 50) });

      if (transferId) {
        let foundTransfer: Transfer | null = null;

        // Try to decode from URL parameter first (works across browsers/devices)
        if (encodedData) {
          console.log('Attempting to decode from URL...');
          foundTransfer = decodeTransferFromUrl(encodedData);
          if (foundTransfer) {
            console.log('Successfully decoded transfer from URL');
          } else {
            console.error('Failed to decode transfer from URL');
          }
        }

        // Fallback: try localStorage
        if (!foundTransfer) {
          console.log('Trying localStorage fallback...');
          const stored = localStorage.getItem(`rift_transfer_${transferId}`);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              parsed.createdAt = new Date(parsed.createdAt);
              parsed.expiresAt = new Date(parsed.expiresAt);
              foundTransfer = parsed;
              console.log('Found transfer in localStorage');
            } catch (error) {
              console.error('Failed to parse localStorage data:', error);
            }
          }
        }

        if (foundTransfer) {
          setRecipientTransfer(foundTransfer);
          setTransferNotFound(false);
          setView('recipient');
        } else {
          console.error('Transfer not found in URL or localStorage');
          setRecipientTransfer(null);
          setTransferNotFound(true);
          setView('recipient');
        }
      }
    };

    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: TransferFile[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push({
          id: generateFileId(),
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          progress: 0,
          status: 'CREATED',
          file,
        });
      }
    }

    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const cancelUpload = useCallback(() => {
    abortRef.current?.abort();
    setFiles(prev => prev.map(f =>
      f.status === 'UPLOADING' ? { ...f, status: 'FAILED' as const } : f
    ));
  }, []);

  const startUpload = useCallback(async () => {
    if (files.length === 0) return;

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    // Create transfer
    const newTransfer = createTransfer(files, config);
    setTransfer(newTransfer);
    setView('uploading');

    // Upload each file
    let allSuccess = true;
    for (const file of newTransfer.files) {
      setFiles(prev => prev.map(f =>
        f.id === file.id ? { ...f, status: 'UPLOADING' as const } : f
      ));

      const success = await simulateUpload(
        file,
        (progress) => {
          setFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, progress } : f
          ));
        },
        signal
      );

      if (!success) {
        allSuccess = false;
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'FAILED' as const } : f
        ));
      } else {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'READY' as const, progress: 100 } : f
        ));
      }
    }

    if (allSuccess) {
      newTransfer.status = 'READY';
      storeTransfer(newTransfer);
      setTransfer(newTransfer);

      // Update URL with transfer ID and encoded data
      const baseUrl = window.location.origin + window.location.pathname;
      const encoded = encodeTransferForUrl(newTransfer);
      // Use URLSearchParams for proper encoding
      const params = new URLSearchParams();
      params.set('t', newTransfer.publicId);
      params.set('d', encoded);
      window.history.pushState({}, '', `${baseUrl}?${params.toString()}`);

      setTimeout(() => setView('ready'), 800);
    }
  }, [files, config]);

  const resetApp = useCallback(() => {
    setFiles([]);
    setTransfer(null);
    setRecipientTransfer(null);
    setTransferNotFound(false);
    setConfig({ expiration: '24h', password: '', downloadLimit: 'unlimited' });
    setView('landing');
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <>
            <Hero
              files={files}
              config={config}
              onAddFiles={addFiles}
              onRemoveFile={removeFile}
              onConfigChange={setConfig}
              onStartUpload={startUpload}
            />
            <Features />
          </>
        );
      case 'uploading':
        return (
          <UploadView
            files={files}
            transfer={transfer}
            onCancel={cancelUpload}
          />
        );
      case 'ready':
        return (
          <ReadyView
            transfer={transfer}
            onNewTransfer={resetApp}
          />
        );
      case 'recipient':
        return (
          <RecipientView
            transfer={recipientTransfer}
            notFound={transferNotFound}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-void bg-grid bg-spotlight relative">
      <ParticleField />
      <div className="noise-overlay" aria-hidden="true" />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #2b7fff, #7c5cfc, #9178ff)'
        }}
      />

      <Header
        view={view}
        onReset={resetApp}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0, y: 30, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -30, rotateX: -4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {renderView()}
        </motion.main>
      </AnimatePresence>

      {view === 'landing' && <Footer />}
    </div>
  );
}

export default App;
