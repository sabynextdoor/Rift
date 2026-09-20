import { motion } from 'framer-motion';
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

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 px-6">
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-glass-border to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-eyebrow mb-4">Why RIFT</div>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-frost tracking-tight mb-4">
            Built for secure, simple transfers
          </h2>
          <p className="text-moon text-lg font-light max-w-xl mx-auto">
            Enterprise-grade security meets consumer simplicity. No compromises.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6 hover:bg-glass-fill-hover transition-colors group"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 mb-4 group-hover:bg-violet/20 transition-colors">
                <feature.icon size={18} className="text-violet-bright" />
              </div>
              <h3 className="text-frost font-medium text-base mb-2">{feature.title}</h3>
              <p className="text-fog text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mt-24 mb-20"
        >
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-4">How it works</div>
            <h3 className="font-display text-2xl md:text-4xl font-medium text-frost tracking-tight">
              Three steps. That's it.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full hover-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-violet-bright/60">{item.step}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-violet/20 to-transparent" />
                  </div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 mb-4">
                    <item.icon size={18} className="text-violet-bright" />
                  </div>
                  <h4 className="text-frost font-medium mb-2">{item.title}</h4>
                  <p className="text-fog text-sm leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight size={16} className="text-violet/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          id="security"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mt-20 glass-card-elevated rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="section-eyebrow mb-3">Security First</div>
              <h3 className="font-display text-2xl md:text-3xl font-medium text-frost tracking-tight mb-4">
                Production-grade security, zero complexity
              </h3>
              <p className="text-moon text-sm leading-relaxed mb-6">
                Every transfer is protected by industry-standard encryption, malware scanning, rate limiting, and automatic cleanup. We never store passwords in plaintext, never expose sequential IDs, and always enforce expiration server-side.
              </p>
              <div className="flex flex-wrap gap-2">
                {['TLS 1.3', 'AES-256', 'Argon2id', 'ClamAV', 'Rate Limiting', 'Signed URLs'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-violet/10 text-violet-bright border border-violet/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-violet/5 rounded-2xl blur-xl" />
              <div className="relative glass-card rounded-2xl p-6 space-y-4">
                {[
                  { label: 'Encryption', value: 'AES-256-GCM', status: 'active' },
                  { label: 'Malware Scan', value: 'ClamAV', status: 'active' },
                  { label: 'Rate Limit', value: '100 req/min', status: 'active' },
                  { label: 'Signed URLs', value: '15 min expiry', status: 'active' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-fog">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-frost font-mono">{item.value}</span>
                      <div className="w-2 h-2 rounded-full bg-success" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
