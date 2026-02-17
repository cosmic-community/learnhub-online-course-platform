import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900/50 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">📚</span>
              <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">LearnHub</span>
            </Link>
            <p className="text-navy-400 max-w-md mb-6">
              Empowering learners worldwide with high-quality courses in web development, 
              design, and more. Start your learning journey today.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: '𝕏', label: 'Twitter' },
                { icon: '💼', label: 'LinkedIn' },
                { icon: '📺', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center text-navy-400 hover:bg-primary-500/20 hover:text-primary-400 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-600 group-hover:bg-primary-500 transition-colors" />
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-navy-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-600 group-hover:bg-primary-500 transition-colors" />
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-600 group-hover:bg-primary-500 transition-colors" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/web-development" className="text-navy-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="group-hover:scale-110 transition-transform">💻</span>
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/categories/cloud-computing" className="text-navy-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="group-hover:scale-110 transition-transform">☁️</span>
                  Cloud Computing
                </Link>
              </li>
              <li>
                <Link href="/categories/mobile-development" className="text-navy-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group">
                  <span className="group-hover:scale-110 transition-transform">📱</span>
                  Mobile Development
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-500 text-sm">
            © {currentYear} LearnHub. All rights reserved.
          </p>
          <p className="text-navy-500 text-sm flex items-center gap-2">
            <span>Powered by</span>
            <a
              href="https://www.cosmicjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 inline-flex items-center gap-1 group"
            >
              <span>Cosmic</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}