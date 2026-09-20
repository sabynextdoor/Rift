import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Clock, Lock, Zap, Globe, Server, Upload, Link2, Download, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Encrypted Transfers',
    description: 'All files are encrypted in transit and at rest. TLS 1.3 for transfers, AES-256 for storage.',
  },
  {
    icon: Clock,
    title: 'Auto-Expiring Links',
    description: 'Set transfers to expire in 1 hour, 24 hours, 3 days, or 7 days. Files are permanently deleted.',
  },
  {
    icon: Lock,
    title: 'Password Protection',
    description: 'Add an optional password to any transfer. Argon2id hashing ensures passwords are never stored in plaintext.',
  },
  {
    icon: Zap,
    title: 'Large File Support',
    description: 'Transfer files up to 5GB each. Chunked uploads with resume support handle any connection.',
  },
  {
    icon: Globe,
    title: 'No Account Required',
    description: 'Senders and recipients need no account. Just drop files, get a link, share it. Done.',
  },
  {
    icon: Server,
    title: 'Direct Storage',
    description: 'Files go directly to S3-compatible storage via signed URLs. Never proxied through our servers.',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: 12, rotateY: index % 2 === 0 ? -8 : 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0, rotateY: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.03,
        rotateY: 2,
        rotateX: -2,
        z: 20,
        transition: { duration: 0.3 }
      }}
      className="premium-panel p-6 premium-card-hover"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="premium-icon-tile mb-5"
        style={{ transform: 'translateZ(20px)' }}
      >
        <feature.icon size={20} className="text-accent" />
      </motion.div>
      <h3 className="text-base font-medium text-ice mb-2" style={{ transform: 'translateZ(10px)' }}>{feature.title}</h3>
      <p className="text-sm text-fog leading-relaxed" style={{ transform: 'translateZ(5px)' }}>{feature.description}</p>
    </motion.div>
  );
}

function HowItWorksStep({ step, icon: Icon, title, description, index, isLast }: {
  step: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stepRef, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={stepRef}
      initial={{
        opacity: 0,
        x: index === 0 ? -80 : index === 2 ? 80 : 0,
        y: index === 1 ? 60 : 0,
        rotateY: index === 0 ? 15 : index === 2 ? -15 : 0,
      }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="premium-panel-raised p-6 h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-accent/60">{step}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-accent/20 to-transparent" />
        </div>
        <motion.div
          className="premium-icon-tile mb-4"
          style={{ transform: 'translateZ(30px)' }}
        >
          <Icon size={20} className="text-accent" />
        </motion.div>
        <h4 className="text-lg font-medium text-ice mb-2" style={{ transform: 'translateZ(15px)' }}>{title}</h4>
        <p className="text-sm text-fog leading-relaxed" style={{ transform: 'translateZ(8px)' }}>{description}</p>
      </motion.div>
      {!isLast && (
        <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={18} className="text-accent/30" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.3, 0.3, 0]);

  return (
    <section ref={sectionRef} id="features" className="relative py-24 md:py-32 px-4 sm:px-6 overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-[200px] pointer-events-none"
        style={{ y: bgY, opacity: glowOpacity }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

      <div className="premium-section relative z-10" style={{ perspective: '1200px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="premium-eyebrow mb-6">Why Rift</div>
          <h2 className="premium-display mb-5">
            Built for secure,
            <br />
            <span className="premium-gradient-text">simple transfers</span>
          </h2>
          <p className="premium-subtitle max-w-xl mx-auto">
            Enterprise-grade security meets consumer simplicity. No compromises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-28">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="premium-eyebrow mb-4">How it works</div>
            <h3 className="premium-display">
              Three steps. That's it.
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Drop your files',
                description: 'Drag and drop or select files up to 5GB each. Multiple files and folders supported.',
              },
              {
                step: '02',
                icon: Link2,
                title: 'Get your link',
                description: 'Configure expiration, password, and download limits. Copy your unique transfer link.',
              },
              {
                step: '03',
                icon: Download,
                title: 'Share & download',
                description: 'Recipients open the link and download instantly. No account needed. Files auto-expire.',
              },
            ].map((item, index, arr) => (
              <HowItWorksStep
                key={item.step}
                step={item.step}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={index}
                isLast={index === arr.length - 1}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          id="security"
          initial={{ opacity: 0, y: 50, rotateX: 6 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="premium-panel-raised p-8 md:p-12"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div style={{ transform: 'translateZ(20px)' }}>
              <div className="premium-eyebrow mb-4">Security First</div>
              <h3 className="premium-display mb-5">
                Production-grade security,
                <br />
                <span className="premium-gradient-text">zero complexity</span>
              </h3>
              <p className="text-sm text-fog leading-relaxed mb-8">
                Every transfer is protected by industry-standard encryption, malware scanning, rate limiting, and automatic cleanup. We never store passwords in plaintext, never expose sequential IDs, and always enforce expiration server-side.
              </p>
              <div className="flex flex-wrap gap-2">
                {['TLS 1.3', 'AES-256', 'Argon2id', 'ClamAV', 'Rate Limiting', 'Signed URLs'].map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="premium-chip"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              style={{ transform: 'translateZ(30px)' }}
              initial={{ opacity: 0, x: 40, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-xl" />
              <div className="relative premium-panel p-6 space-y-5">
                {[
                  { label: 'Encryption', value: 'AES-256-GCM', status: 'active' },
                  { label: 'Malware Scan', value: 'ClamAV', status: 'active' },
                  { label: 'Rate Limit', value: '100 req/min', status: 'active' },
                  { label: 'Signed URLs', value: '15 min expiry', status: 'active' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-fog">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-frost font-mono">{item.value}</span>
                      <div className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
