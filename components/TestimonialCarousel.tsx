'use client'

import { useState, useEffect, useCallback } from 'react'

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
    role: 'Frontend Developer at Stripe',
    avatar: '👩‍💻',
    content: 'The React course completely transformed my career. Within 3 months of completing it, I landed my dream job. The project-based approach made all the difference.',
    rating: 5,
    course: 'React Fundamentals'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Full Stack Engineer',
    avatar: '👨‍💻',
    content: 'I\'ve tried many online platforms, but LearnHub stands out. The instructors actually respond to questions and the community is incredibly supportive.',
    rating: 5,
    course: 'Node.js Backend Development'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'DevOps Engineer at AWS',
    avatar: '👩‍🔬',
    content: 'The AWS Fundamentals course was exactly what I needed to transition into cloud. Clear explanations, real-world examples, and hands-on labs.',
    rating: 5,
    course: 'AWS Fundamentals'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Startup Founder',
    avatar: '🧑‍💼',
    content: 'As a non-technical founder, these courses helped me understand what my development team does. Now I can communicate more effectively with engineers.',
    rating: 5,
    course: 'Vue.js Fundamentals'
  }
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextTestimonial])

  const currentTestimonial = testimonials[currentIndex]

  if (!currentTestimonial) return null

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-4xl mx-auto">
        {/* Quote Icon */}
        <div className="text-primary-500/20 text-8xl font-serif leading-none mb-4">&ldquo;</div>
        
        {/* Testimonial Content */}
        <div className="relative min-h-[200px]">
          <div 
            key={currentTestimonial.id}
            className="animate-in fade-in slide-in-from-right-4 duration-500"
          >
            <p className="text-xl md:text-2xl text-navy-200 leading-relaxed mb-8">
              {currentTestimonial.content}
            </p>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl">
                {currentTestimonial.avatar}
              </div>
              <div>
                <div className="font-semibold text-white">{currentTestimonial.name}</div>
                <div className="text-navy-400 text-sm">{currentTestimonial.role}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-navy-500 text-sm">• {currentTestimonial.course}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-primary-500' 
                    : 'bg-navy-700 hover:bg-navy-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}