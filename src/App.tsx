import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, TransferFile, TransferConfig, Transfer } from './types';
import { generateFileId, validateFile, simulateUpload, createTransfer, storeTransfer, getTransfer } from './utils/transfer';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadView from './components/UploadView';
import ReadyView from './components/ReadyView';
import RecipientView from './components/RecipientView';
import Features from './components/Features';
import Footer from './components/Footer';
import ParticleField from './components/ParticleField';
import ScrollProgress from './components/ScrollProgress';

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
  const abortRef = useRef<AbortController | null>(null);

  // Check URL for recipient mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transferId = params.get('t');
    if (transferId) {
      const t = getTransfer(transferId);
      if (t) {
        setRecipientTransfer(t);
        setView('recipient');
      }
    }
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
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('t', newTransfer.publicId);
      window.history.pushState({}, '', url.toString());
      
      setTimeout(() => setView('ready'), 800);
    }
  }, [files, config]);

  const resetApp = useCallback(() => {
    setFiles([]);
    setTransfer(null);
    setRecipientTransfer(null);
    setView('landing');
    window.history.pushState({}, '', window.location.pathname);
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-void bg-grid bg-spotlight relative">
      <ParticleField />
      <ScrollProgress />
      <div className="noise-overlay" aria-hidden="true" />
      <Header 
        view={view}
        onReset={resetApp}
      />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderView()}
        </motion.main>
      </AnimatePresence>

      {view === 'landing' && <Footer />}
    </div>
  );
}

export default App;
