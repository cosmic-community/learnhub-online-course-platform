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
              <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
              <span className="text-xl font-bold text-white">LearnHub</span>
            </Link>
            <p className="text-navy-400 max-w-md mb-4">
              Empowering learners worldwide with high-quality courses in web development, 
              design, and more. Start your learning journey today.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {[
                { icon: '𝕏', label: 'Twitter', href: '#' },
                { icon: '📺', label: 'YouTube', href: '#' },
                { icon: '💼', label: 'LinkedIn', href: '#' },
                { icon: '🐙', label: 'GitHub', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-navy-800 hover:bg-navy-700 flex items-center justify-center text-navy-400 hover:text-white transition-all hover:scale-105"
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
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/web-development" className="text-navy-400 hover:text-primary-400 transition-colors">
                  💻 Web Development
                </Link>
              </li>
              <li>
                <Link href="/categories/cloud-computing" className="text-navy-400 hover:text-primary-400 transition-colors">
                  ☁️ Cloud Computing
                </Link>
              </li>
              <li>
                <Link href="/categories/mobile-development" className="text-navy-400 hover:text-primary-400 transition-colors">
                  📱 Mobile Development
                </Link>
              </li>
              <li>
                <Link href="/categories/data-science" className="text-navy-400 hover:text-primary-400 transition-colors">
                  📊 Data Science
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-12 p-6 bg-navy-800/50 rounded-2xl border border-navy-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold mb-1">Stay updated with new courses</h3>
              <p className="text-navy-400 text-sm">Get notified when we launch new courses and features.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 focus:outline-none focus:border-primary-500"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-500 text-sm">
            © {currentYear} LearnHub. All rights reserved.
          </p>
          <p className="text-navy-500 text-sm flex items-center gap-2">
            Made with <span className="text-red-500 animate-pulse">❤️</span> • Powered by{' '}
            <a
              href="https://www.cosmicjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Cosmic
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}