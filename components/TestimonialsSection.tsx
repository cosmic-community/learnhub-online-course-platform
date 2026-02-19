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
    role: 'Frontend Developer at Stripe',
    avatar: '👩‍💻',
    content: 'LearnHub completely transformed my career. The Vue.js course was incredibly well-structured and the instructor explanations were top-notch. Landed my dream job within 3 months!',
    rating: 5,
    course: 'Vue.js Fundamentals'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'DevOps Engineer',
    avatar: '👨‍🔧',
    content: 'The AWS Fundamentals course gave me the confidence to pursue cloud certifications. The hands-on projects were exactly what I needed to learn effectively.',
    rating: 5,
    course: 'AWS Fundamentals'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Full-Stack Developer',
    avatar: '👩‍🎨',
    content: 'I love how the courses are structured with both theory and practical examples. The Node.js Backend course helped me build production-ready APIs from scratch.',
    rating: 5,
    course: 'Node.js Backend Development'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Junior Developer',
    avatar: '👨‍💻',
    content: 'As a beginner, I was intimidated by coding. LearnHub made it accessible and fun! The community support is amazing too.',
    rating: 5,
    course: 'React Fundamentals'
  },
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
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
    <section className="py-20 bg-gradient-to-b from-navy-950 to-navy-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium mb-4">
            <span>⭐</span> Student Success Stories
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of satisfied learners</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Cards */}
          <div className="relative h-[320px] md:h-[280px]">
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
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-navy-700'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="flex-1">
                    <p className="text-navy-200 text-lg leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  </blockquote>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-navy-400">{testimonial.role}</p>
                    </div>
                    <div className="ml-auto hidden sm:block">
                      <span className="text-sm text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">
                        {testimonial.course}
                      </span>
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
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-primary-500'
                    : 'bg-navy-700 hover:bg-navy-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
              setIsAutoPlaying(false)
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-navy-400 hover:text-white hover:border-navy-600 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setActiveIndex((current) => (current + 1) % testimonials.length)
              setIsAutoPlaying(false)
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-navy-400 hover:text-white hover:border-navy-600 transition-colors"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">10,000+</div>
            <div className="text-sm text-navy-400">Students Enrolled</div>
          </div>
          <div className="w-px h-8 bg-navy-800 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.9/5</div>
            <div className="text-sm text-navy-400">Average Rating</div>
          </div>
          <div className="w-px h-8 bg-navy-800 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">95%</div>
            <div className="text-sm text-navy-400">Completion Rate</div>
          </div>
          <div className="w-px h-8 bg-navy-800 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">30-Day</div>
            <div className="text-sm text-navy-400">Money Back Guarantee</div>
          </div>
        </div>
      </div>
    </section>
  )
}