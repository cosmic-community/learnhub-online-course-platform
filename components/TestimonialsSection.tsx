'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  course: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: "The Vue.js course completely transformed my approach to frontend development. The instructor's real-world examples made complex concepts click immediately.",
    course: 'Vue.js Fundamentals',
    rating: 5
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'DevOps Engineer',
    avatar: '👨‍💻',
    content: "I went from zero AWS knowledge to deploying production applications in just a few weeks. The hands-on labs were incredibly valuable.",
    course: 'AWS Fundamentals',
    rating: 5
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    role: 'Full Stack Developer',
    avatar: '👩‍🔬',
    content: "The Node.js backend course helped me land my dream job! The instructor explains everything so clearly, even the complex async patterns.",
    course: 'Node.js Backend Development',
    rating: 5
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Software Architect',
    avatar: '🧑‍💻',
    content: "Finally, a course that goes beyond the basics. The TypeScript patterns I learned here have made my code so much more maintainable.",
    course: 'Advanced TypeScript',
    rating: 5
  },
]

export default function TestimonialsSection() {
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
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-20 bg-navy-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-4xl mb-4">💬</span>
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of satisfied learners</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Cards */}
          <div className="relative h-[320px] sm:h-[280px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === activeIndex
                    ? 'opacity-100 translate-x-0 scale-100'
                    : index < activeIndex
                      ? 'opacity-0 -translate-x-full scale-95'
                      : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                <div className="card p-8 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-navy-200 flex-1">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-navy-800">
                    <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-navy-400">{testimonial.role}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs text-navy-500">Completed</div>
                      <div className="text-sm text-primary-400">{testimonial.course}</div>
                    </div>
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
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-primary-500 w-8'
                    : 'bg-navy-700 hover:bg-navy-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              setIsAutoPlaying(false)
              setTimeout(() => setIsAutoPlaying(true), 10000)
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-10 h-10 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev + 1) % testimonials.length)
              setIsAutoPlaying(false)
              setTimeout(() => setIsAutoPlaying(true), 10000)
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-10 h-10 bg-navy-800 hover:bg-navy-700 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}