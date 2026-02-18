'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  course: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: 'The Vue.js course transformed my career! I went from struggling with basics to building production apps in just weeks.',
    rating: 5,
    course: 'Vue.js Fundamentals'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'DevOps Engineer',
    avatar: '👨‍🔧',
    content: 'AWS Fundamentals gave me the confidence to handle cloud infrastructure. The hands-on labs were incredibly practical.',
    rating: 5,
    course: 'AWS Fundamentals'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Full Stack Developer',
    avatar: '👩‍🎨',
    content: 'Node.js Backend Development is exactly what I needed. The Express.js section was a game-changer for my projects.',
    rating: 5,
    course: 'Node.js Backend'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Software Architect',
    avatar: '🧑‍💼',
    content: 'The instructors are world-class. I appreciate how they explain complex concepts in simple, practical ways.',
    rating: 5,
    course: 'TypeScript Mastery'
  }
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Testimonials</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">Loved by Learners Worldwide</h2>
          <p className="text-navy-400">Join thousands of students who have transformed their careers</p>
        </div>
        
        {/* Testimonial Cards */}
        <div className="relative h-[280px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`absolute inset-0 transition-all duration-500 ease-out ${
                index === activeIndex
                  ? 'opacity-100 translate-x-0 scale-100'
                  : index < activeIndex
                  ? 'opacity-0 -translate-x-full scale-95'
                  : 'opacity-0 translate-x-full scale-95'
              }`}
            >
              <div className="card p-8 h-full flex flex-col items-center text-center bg-gradient-to-br from-navy-900/80 to-navy-950/80">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-primary-500/20">
                  {testimonial.avatar}
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                
                {/* Content */}
                <blockquote className="text-navy-200 text-lg italic mb-4 flex-1">
                  "{testimonial.content}"
                </blockquote>
                
                {/* Author */}
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-navy-400">{testimonial.role}</div>
                  <div className="text-xs text-primary-400 mt-1">Completed: {testimonial.course}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-primary-400 w-8'
                  : 'bg-navy-600 hover:bg-navy-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-navy-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-sm">10,000+ Graduates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-sm">4.9/5 Average Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="text-sm">150+ Countries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💼</span>
            <span className="text-sm">85% Career Boost</span>
          </div>
        </div>
      </div>
    </section>
  )
}