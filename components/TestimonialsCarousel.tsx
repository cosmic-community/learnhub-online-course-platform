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
    name: "Sarah Johnson",
    role: "Frontend Developer",
    avatar: "👩‍💻",
    content: "The courses here completely transformed my career. I went from a beginner to landing my dream job in just 6 months!",
    rating: 5,
    course: "React Fundamentals"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Full Stack Engineer",
    avatar: "👨‍💻",
    content: "The instructors are world-class. Their real-world experience shines through in every lesson.",
    rating: 5,
    course: "Node.js Backend Development"
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "UX Designer",
    avatar: "👩‍🎨",
    content: "I love how interactive the courses are. The projects helped me build an amazing portfolio.",
    rating: 5,
    course: "Vue.js Fundamentals"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "DevOps Engineer",
    avatar: "🧑‍💻",
    content: "The AWS course was exactly what I needed to get certified. Highly recommended!",
    rating: 5,
    course: "AWS Fundamentals"
  },
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-navy-900/30 to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-4xl">💬</span>
            What Our Students Say
          </h2>
          <p className="text-navy-400">Join thousands of satisfied learners</p>
        </div>

        <div className="relative">
          {/* Main testimonial card */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-navy-900/50 backdrop-blur-sm rounded-3xl p-8 border border-navy-800 text-center">
                    {/* Avatar */}
                    <div className="text-6xl mb-4">{testimonial.avatar}</div>
                    
                    {/* Rating */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    
                    {/* Content */}
                    <blockquote className="text-xl text-navy-200 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    
                    {/* Author */}
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-navy-400 text-sm">{testimonial.role}</div>
                    <div className="text-primary-400 text-sm mt-1">
                      Completed: {testimonial.course}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 bg-primary-500' 
                    : 'bg-navy-700 hover:bg-navy-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}