'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: 'The Vue.js course completely transformed how I approach frontend development. The instructor explains complex concepts in such a clear way!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'DevOps Engineer',
    avatar: '👨‍💼',
    content: 'AWS Fundamentals gave me the confidence to deploy production applications. I got my certification shortly after completing this course.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Full Stack Developer',
    avatar: '👩‍🎨',
    content: 'The Node.js backend course is exactly what I needed. Real-world projects and best practices - this is how learning should be!',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Software Engineer',
    avatar: '👨‍🔬',
    content: 'I switched careers after taking courses here. The structured learning path made all the difference in my journey.',
    rating: 5,
  },
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setIsAnimating(false)
      }, 300)
    }
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Main testimonial card */}
      <div className="card p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative quote marks */}
        <div className="absolute top-4 left-4 text-6xl text-primary-500/10 font-serif">
          &ldquo;
        </div>
        <div className="absolute bottom-4 right-4 text-6xl text-primary-500/10 font-serif">
          &rdquo;
        </div>

        {/* Content */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Avatar */}
          <div className="text-5xl mb-6">{currentTestimonial.avatar}</div>

          {/* Rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl text-navy-200 mb-6 leading-relaxed">
            &ldquo;{currentTestimonial.content}&rdquo;
          </blockquote>

          {/* Author */}
          <div>
            <div className="font-semibold text-white">{currentTestimonial.name}</div>
            <div className="text-sm text-navy-400">{currentTestimonial.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary-500 w-8' 
                : 'bg-navy-700 hover:bg-navy-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}