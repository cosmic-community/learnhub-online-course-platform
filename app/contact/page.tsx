import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - LearnHub',
  description: 'Get in touch with LearnHub. We\'re here to help with your questions about courses, technical support, and more.',
}

export default function ContactPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-primary-400">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">Contact</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-navy-300 max-w-2xl mx-auto">
            Have a question or need assistance? We&apos;re here to help. Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-8 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-navy-400 text-sm">Email</div>
                    <a href="mailto:support@learnhub.com" className="text-white hover:text-primary-400 transition-colors">
                      support@learnhub.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-navy-400 text-sm">Response Time</div>
                    <div className="text-white">Within 24-48 hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/courses" className="text-navy-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-navy-300 hover:text-primary-400 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Explore Categories
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}