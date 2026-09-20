import { motion, AnimatePresence } from 'framer-motion';
import { motion as motionTokens, riftVariants } from '../utils/motion';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation } from 'lucide-react';

interface FileDropAnimationProps {
  file: File;
  onComplete?: () => void;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image size={24} />;
  if (type.startsWith('video/')) return <Film size={24} />;
  if (type.startsWith('audio/')) return <Music size={24} />;
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) return <Archive size={24} />;
  if (type.includes('pdf')) return <FileText size={24} />;
  if (type.includes('word') || type.includes('document')) return <FileText size={24} />;
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <Table size={24} />;
  if (type.includes('presentation') || type.includes('powerpoint')) return <Presentation size={24} />;
  return <File size={24} />;
}

export default function FileDropAnimation({ file, onComplete }: FileDropAnimationProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial="initial"
      animate="absorb"
      variants={riftVariants.fileEnter}
      onAnimationComplete={onComplete}
    >
      {/* File representation */}
      <div className="relative">
        {/* Glow effect during absorption */}
        <motion.div
          className="absolute inset-0 bg-accent/30 rounded-xl blur-xl"
          animate={{
            scale: [1, 1.5, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: motionTokens.standard,
            times: [0, 0.5, 1],
          }}
        />

        {/* File icon */}
        <div className="relative w-16 h-16 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent">
          {getFileIcon(file.type)}
        </div>

        {/* Compression rings */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-accent"
          animate={{
            scale: [1, 0.5, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: motionTokens.standard,
            times: [0, 0.6, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

// Multiple files drop animation with stagger
interface MultipleFilesDropProps {
  files: File[];
  onComplete?: () => void;
}

export function MultipleFilesDropAnimation({ files, onComplete }: MultipleFilesDropProps) {
  return (
    <div className="relative flex items-center justify-center gap-2">
      <AnimatePresence>
        {files.slice(0, 5).map((file, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{
              scale: [0, 1, 0.3, 0],
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -20],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: motionTokens.slow,
              delay: index * motionTokens.stagger.fast,
              times: [0, 0.3, 0.7, 1],
            }}
            onAnimationComplete={index === files.length - 1 ? onComplete : undefined}
          >
            <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-accent">
              {getFileIcon(file.type)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* "+X more" indicator if more than 5 files */}
      {files.length > 5 && (
        <motion.div
          className="text-caption text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: motionTokens.standard }}
        >
          +{files.length - 5} more
        </motion.div>
      )}
    </div>
  );
}
