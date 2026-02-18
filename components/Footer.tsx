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
            {/* Fun tagline */}
            <p className="text-sm text-primary-400/80 italic">
              "Every expert was once a beginner" ✨
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🔗</span> Quick Links
            </h3>
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
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🏷️</span> Categories
            </h3>
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
            </ul>
          </div>
        </div>

        {/* Newsletter teaser */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-primary-600/10 via-primary-500/5 to-primary-600/10 border border-primary-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💌</span>
              <div>
                <h4 className="text-white font-semibold">Stay in the loop!</h4>
                <p className="text-navy-400 text-sm">New courses and learning tips delivered weekly.</p>
              </div>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap">
              Get Updates
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-500 text-sm flex items-center gap-2">
            © {currentYear} LearnHub. Made with <span className="text-red-400 animate-pulse">❤️</span> for learners everywhere.
          </p>
          <p className="text-navy-500 text-sm">
            Powered by{' '}
            <a
              href="https://www.cosmicjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Cosmic ✨
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}