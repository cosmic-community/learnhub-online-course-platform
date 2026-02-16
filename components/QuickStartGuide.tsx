'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function QuickStartGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenGuide, setHasSeenGuide] = useState(true)

  useEffect(() => {
    // Check if user has seen the guide before
    const seen = localStorage.getItem('learnhub-quickstart-seen')
    if (!seen) {
      setHasSeenGuide(false)
      // Auto-open after a delay for new users
      const timer = setTimeout(() => setIsOpen(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissGuide = () => {
    setIsOpen(false)
    localStorage.setItem('learnhub-quickstart-seen', 'true')
    setHasSeenGuide(true)
  }

  const steps = [
    {
      icon: '🔍',
      title: 'Browse Courses',
      description: 'Explore our catalog of expert-led courses',
      link: '/courses'
    },
    {
      icon: '📚',
      title: 'Pick a Category',
      description: 'Find courses in your area of interest',
      link: '/categories'
    },
    {
      icon: '🎯',
      title: 'Start Learning',
      description: 'Begin with any lesson at your own pace',
      link: '/courses'
    }
  ]

  if (hasSeenGuide && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg shadow-primary-500/25 transition-all hover:scale-110"
        aria-label="Open quick start guide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={dismissGuide}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-primary-500/20 to-transparent">
          <button
            onClick={dismissGuide}
            className="absolute top-4 right-4 p-2 text-navy-400 hover:text-white transition-colors"
            aria-label="Close guide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-4xl">🚀</span>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Start Guide</h2>
              <p className="text-navy-300 text-sm">Get started in 3 easy steps</p>
            </div>
          </div>
        </div>
        
        {/* Steps */}
        <div className="p-6 space-y-4">
          {steps.map((step, index) => (
            <Link
              key={index}
              href={step.link}
              onClick={dismissGuide}
              className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 border border-transparent hover:border-primary-500/30 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-navy-700 rounded-xl text-2xl group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-primary-400 text-sm font-medium">Step {index + 1}</span>
                </div>
                <h3 className="text-white font-semibold">{step.title}</h3>
                <p className="text-navy-400 text-sm">{step.description}</p>
              </div>
              <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-navy-800 bg-navy-900/50">
          <p className="text-center text-navy-400 text-sm">
            Need help? <Link href="/contact" onClick={dismissGuide} className="text-primary-400 hover:text-primary-300">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}