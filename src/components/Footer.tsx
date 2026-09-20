export default function Footer() {
  return (
    <footer className="relative border-t border-hairline">
      <div className="premium-section py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-accent">
                  <path d="M3 2L8 14L13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 8H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base font-medium tracking-tight text-ice font-display">Rift</span>
            </div>
            <p className="text-sm text-fog leading-relaxed">
              Secure file transfers with expiring links. Send files, share a link, done.
            </p>
            <p className="text-xs text-fog/60 mt-2">
              Designed & built by Saby
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-frost mb-4">Product</h4>
            <ul className="space-y-2.5">
              {['Features', 'Security', 'Pricing', 'API'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-fog hover:text-ice transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-frost mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {['Documentation', 'API Reference', 'Status', 'Changelog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-fog hover:text-ice transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-frost mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Security', 'GDPR'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-fog hover:text-ice transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-fog">
            © {new Date().getFullYear()} Rift by Saby. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-fog">
              <div className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
