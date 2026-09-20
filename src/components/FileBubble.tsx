import { motion, useMotionValue, useSpring } from 'framer-motion';
import { liquidGlass } from '../utils/liquidGlass';
import { File, Image, Film, Music, Archive, FileText, Table, Presentation } from 'lucide-react';

interface FileBubbleProps {
  file: File;
  index?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
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

export default function FileBubble({ file, index = 0, onDragStart, onDragEnd }: FileBubbleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing"
      style={{
        x: springX,
        y: springY,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      transition={{
        duration: liquidGlass.timing.form,
        delay: index * 0.1,
        ease: liquidGlass.easing.liquid as any,
      }}
    >
      {/* Bubble container */}
      <motion.div
        className="relative w-24 h-24 rounded-full"
        style={{
          background: `
            radial-gradient(
              ellipse at 30% 30%,
              rgba(255, 255, 255, 0.15) 0%,
              rgba(10, 132, 255, 0.08) 50%,
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.15),
            0 8px 32px rgba(0, 0, 0, 0.3)
          `,
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
        whileDrag={{
          scale: 1.1,
          transition: { duration: 0.2 },
        }}
      >
        {/* Internal highlight */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(
                ellipse at 30% 20%,
                rgba(255, 255, 255, 0.2) 0%,
                transparent 50%
              )
            `,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* File icon */}
        <div className="absolute inset-0 flex items-center justify-center text-white/80">
          {getFileIcon(file.type)}
        </div>

        {/* Surface ripple on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(10, 132, 255, 0.2) 0%, transparent 70%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{
            scale: 1.5,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.6,
            ease: liquidGlass.easing.ripple as any,
          }}
        />
      </motion.div>

      {/* File name label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
      </motion.div>
    </motion.div>
  );
}
