'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BANNERS = [
  {
    emoji: '🎉',
    title: 'New Year, New Skills!',
    description: 'Start 2025 with expert-led courses',
    cta: 'Explore Courses',
    link: '/courses',
    gradient: 'from-primary-500/20 to-blue-500/20',
  },
  {
    emoji: '🚀',
    title: 'Level Up Your Career',
    description: 'Learn the most in-demand skills',
    cta: 'Browse Categories',
    link: '/categories',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    emoji: '💡',
    title: 'Learn from the Best',
    description: 'Industry experts share their knowledge',
    cta: 'Meet Instructors',
    link: '/instructors',
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
]

export default function FeaturedBanner() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % BANNERS.length)
        setIsVisible(true)
      }, 300)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const banner = BANNERS[currentBanner]
  
  if (!banner) return null

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.gradient} border border-navy-700 p-6`}>
      <div className="absolute inset-0 bg-navy-900/40" />
      
      <div 
        className={`relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl animate-float">{banner.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{banner.title}</h3>
            <p className="text-navy-300">{banner.description}</p>
          </div>
        </div>
        
        <Link href={banner.link} className="btn-primary whitespace-nowrap">
          {banner.cta} →
        </Link>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentBanner 
                ? 'bg-primary-400 w-6' 
                : 'bg-navy-600 hover:bg-navy-500'
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}