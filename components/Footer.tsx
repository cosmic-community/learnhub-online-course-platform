import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900/50 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-white">LearnHub</span>
            </Link>
            <p className="text-navy-400 max-w-md">
              Empowering learners worldwide with high-quality courses in web development, 
              design, and more. Start your learning journey today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-navy-400 hover:text-primary-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/web-development" className="text-navy-400 hover:text-primary-400 transition-colors">
                  💻 Web Development
                </Link>
              </li>
              <li>
                <Link href="/categories/design" className="text-navy-400 hover:text-primary-400 transition-colors">
                  🎨 Design
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-500 text-sm">
            © {currentYear} LearnHub. All rights reserved.
          </p>
          <p className="text-navy-500 text-sm">
            Powered by{' '}
            <a
              href="https://www.cosmicjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300"
            >
              Cosmic
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}