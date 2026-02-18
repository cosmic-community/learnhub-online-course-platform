'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    quote: "LearnHub transformed my career. I went from a junior developer to a senior engineer in just 18 months.",
    author: "Sarah Chen",
    role: "Senior Software Engineer at Google",
    avatar: "👩‍💻"
  },
  {
    quote: "The courses are incredibly well-structured. Each lesson builds perfectly on the last.",
    author: "Marcus Johnson",
    role: "Full Stack Developer at Stripe",
    avatar: "👨‍💻"
  },
  {
    quote: "I love how practical the projects are. I built my portfolio while learning, and it helped me land my dream job.",
    author: "Emily Rodriguez",
    role: "Frontend Developer at Airbnb",
    avatar: "👩‍🎨"
  },
  {
    quote: "The instructor support is amazing. Every question I had was answered within hours.",
    author: "David Kim",
    role: "Tech Lead at Netflix",
    avatar: "🧑‍💼"
  }
]

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex])

  const nextTestimonial = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      setIsAnimating(false)
    }, 300)
  }

  const prevTestimonial = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setIsAnimating(false)
    }, 300)
  }

  const current = testimonials[currentIndex]

  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Quote decoration */}
      <div className="absolute -top-4 -left-4 text-8xl text-primary-500/10 font-serif">
        "
      </div>
      
      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <blockquote className="text-xl md:text-2xl text-white text-center font-light leading-relaxed mb-8">
          "{current.quote}"
        </blockquote>
        
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-3">{current.avatar}</span>
          <div className="text-center">
            <div className="text-white font-semibold">{current.author}</div>
            <div className="text-navy-400 text-sm">{current.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsAnimating(false)
              }, 300)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-primary-500' 
                : 'bg-navy-600 hover:bg-navy-500'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 text-navy-400 hover:text-white transition-colors hidden lg:block"
        aria-label="Previous testimonial"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 text-navy-400 hover:text-white transition-colors hidden lg:block"
        aria-label="Next testimonial"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}