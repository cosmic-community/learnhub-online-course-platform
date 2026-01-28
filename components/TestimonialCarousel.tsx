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

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: 'LearnHub transformed my career! The React course was exactly what I needed to land my dream job.',
    rating: 5,
    course: 'React Fundamentals',
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    avatar: '👨‍💼',
    content: 'The instructors are world-class. I went from zero coding knowledge to building my own SaaS in 6 months.',
    rating: 5,
    course: 'Full Stack Development',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    avatar: '👩‍🎨',
    content: 'Amazing content quality and the community is so supportive. Best investment in my education!',
    rating: 5,
    course: 'Vue.js Fundamentals',
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'DevOps Engineer',
    avatar: '🧑‍💻',
    content: 'The AWS course helped me get certified and negotiate a 40% salary increase. Highly recommended!',
    rating: 5,
    course: 'AWS Fundamentals',
  },
]

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const testimonial = TESTIMONIALS[activeIndex]

  if (!testimonial) return null

  return (
    <div 
      className="card p-8 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative quote */}
      <div className="absolute top-4 left-4 text-6xl text-primary-500/10 font-serif">"</div>
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-2xl">
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold text-white">{testimonial.name}</div>
            <div className="text-sm text-navy-400">{testimonial.role}</div>
          </div>
          <div className="ml-auto">
            <div className="flex gap-0.5">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">⭐</span>
              ))}
            </div>
          </div>
        </div>

        <blockquote className="text-lg text-navy-200 mb-4 leading-relaxed">
          "{testimonial.content}"
        </blockquote>

        <div className="text-sm text-primary-400">
          Completed: {testimonial.course}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex 
                  ? 'bg-primary-500 w-6' 
                  : 'bg-navy-700 hover:bg-navy-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}