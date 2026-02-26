'use client'

import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setProgress(scrollPercent)
      setIsVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-navy-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed right-5 bottom-24 z-40 p-3 bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-full shadow-lg transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Progress percentage (shows when scrolling) */}
      {isVisible && progress > 5 && progress < 95 && (
        <div className="fixed right-5 bottom-40 z-40 bg-navy-800/90 backdrop-blur-sm border border-navy-700 rounded-lg px-3 py-1.5 text-sm text-navy-200">
          {Math.round(progress)}%
        </div>
      )}
    </>
  )
}