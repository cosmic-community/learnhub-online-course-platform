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
              <span className="text-2xl group-hover:animate-bounce-slow">📚</span>
              <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">LearnHub</span>
            </Link>
            <p className="text-navy-400 max-w-md mb-4">
              Empowering learners worldwide with high-quality courses in web development, 
              design, and more. Start your learning journey today.
            </p>
            {/* Social-style icons (decorative) */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-navy-700 transition-colors cursor-pointer">
                <span className="text-sm">🐦</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-navy-700 transition-colors cursor-pointer">
                <span className="text-sm">💼</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center hover:bg-navy-700 transition-colors cursor-pointer">
                <span className="text-sm">📸</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🔗</span> Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🏷️</span> Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/web-development" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span>💻</span> Web Development
                </Link>
              </li>
              <li>
                <Link href="/categories/cloud-computing" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span>☁️</span> Cloud Computing
                </Link>
              </li>
              <li>
                <Link href="/categories/mobile-development" className="text-navy-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                  <span>📱</span> Mobile Development
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter (decorative) */}
        <div className="mt-12 pt-8 border-t border-navy-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay Updated</h4>
              <p className="text-navy-400 text-sm">Get notified about new courses and updates</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:border-primary-500 focus:outline-none flex-1 md:w-64"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-500 text-sm flex items-center gap-2">
            <span>©</span> {currentYear} LearnHub. All rights reserved.
          </p>
          <p className="text-navy-500 text-sm flex items-center gap-2">
            Built with <span className="text-red-400 animate-pulse">❤️</span> using{' '}
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