import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us - LearnHub',
  description: 'Get in touch with the LearnHub team. We\'re here to help with any questions about our courses.',
}

export default function ContactPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-navy-300 max-w-2xl mx-auto">
            Have a question or feedback? We&apos;d love to hear from you. 
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="card p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">📧</span>
                  Email Us
                </h3>
                <p className="text-navy-400">
                  support@learnhub.com
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">⏰</span>
                  Response Time
                </h3>
                <p className="text-navy-400">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Quick Tips
                </h3>
                <ul className="text-navy-400 space-y-2 text-sm">
                  <li>• Include course name for course-specific questions</li>
                  <li>• Provide screenshots if reporting issues</li>
                  <li>• Check our FAQ for common questions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}