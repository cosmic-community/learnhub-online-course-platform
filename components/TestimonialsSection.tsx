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
    name: "Sarah Chen",
    role: "Frontend Developer",
    avatar: "👩‍💻",
    content: "The courses here completely transformed my career. I went from knowing basic HTML to building full-stack applications in just 6 months!",
    rating: 5,
    course: "React Mastery"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "UX Designer",
    avatar: "👨‍🎨",
    content: "The instructors are incredibly knowledgeable and the project-based learning approach helped me build a portfolio that landed me my dream job.",
    rating: 5,
    course: "Vue.js Fundamentals"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Software Engineer",
    avatar: "👩‍🔬",
    content: "Best investment I've made in my education. The community support and hands-on projects make learning fun and effective.",
    rating: 5,
    course: "AWS Fundamentals"
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-navy-700'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
        setIsAnimating(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDotClick = (index: number) => {
    if (index !== activeIndex) {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsAnimating(false)
      }, 300)
    }
  }

  return (
    <section className="py-20 bg-navy-900/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full text-primary-400 text-sm font-medium mb-4">
            💬 Student Success Stories
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of successful learners</p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div 
            className={`card p-8 md:p-12 text-center transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            }`}
          >
            {/* Quote icon */}
            <div className="absolute top-4 left-4 text-6xl text-primary-500/10 font-serif">
              &ldquo;
            </div>
            
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-4xl ring-4 ring-primary-500/20">
              {testimonials[activeIndex].avatar}
            </div>
            
            {/* Rating */}
            <div className="flex justify-center mb-6">
              <StarRating rating={testimonials[activeIndex].rating} />
            </div>
            
            {/* Content */}
            <blockquote className="text-xl md:text-2xl text-white font-medium mb-6 leading-relaxed">
              &ldquo;{testimonials[activeIndex].content}&rdquo;
            </blockquote>
            
            {/* Author */}
            <div className="mb-4">
              <p className="text-white font-semibold text-lg">
                {testimonials[activeIndex].name}
              </p>
              <p className="text-navy-400">
                {testimonials[activeIndex].role}
              </p>
            </div>
            
            {/* Course badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800 rounded-full text-sm text-navy-300">
              <span>📚</span>
              Completed: {testimonials[activeIndex].course}
            </span>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-navy-700 hover:bg-navy-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}