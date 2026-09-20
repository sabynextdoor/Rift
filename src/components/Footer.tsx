import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet/15 border border-violet/25 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-violet-bright">
                  <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base font-display font-semibold tracking-tight text-frost">RIFT</span>
            </div>
            <p className="text-sm text-fog leading-relaxed">
              Secure file transfers with expiring links. Send files, share a link, done.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium text-frost mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'Security', 'Pricing', 'API'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-fog hover:text-frost transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium text-frost mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Documentation', 'API Reference', 'Status', 'Changelog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-fog hover:text-frost transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium text-frost mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-fog hover:text-frost transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-fog">
            © {new Date().getFullYear()} RIFT. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-fog">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
