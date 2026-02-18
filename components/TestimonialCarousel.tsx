'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer at Stripe',
    avatar: '👩‍💻',
    content: 'LearnHub helped me transition from marketing to software engineering. The project-based approach made all the difference.',
    course: 'React Fundamentals'
  },
  {
    name: 'Marcus Johnson',
    role: 'Full Stack Developer',
    avatar: '👨‍💻',
    content: 'The instructors are world-class. I landed my dream job 3 months after completing the Node.js course.',
    course: 'Node.js Backend Development'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Junior Developer at Shopify',
    avatar: '👩‍🎨',
    content: 'Clear explanations, practical projects, and a supportive community. Everything you need to learn coding.',
    course: 'Vue.js Fundamentals'
  },
  {
    name: 'David Park',
    role: 'DevOps Engineer',
    avatar: '🧑‍💻',
    content: 'The AWS course was exactly what I needed for my cloud certification. Highly recommended!',
    course: 'AWS Fundamentals'
  }
]

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of successful learners</p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main testimonial */}
          <div className="card p-8 md:p-12 text-center relative">
            <div className="absolute top-6 left-6 text-6xl text-primary-500/20">"</div>
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-navy-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                {testimonials[activeIndex]?.avatar}
              </div>
              
              <p className="text-lg md:text-xl text-navy-200 mb-6 italic leading-relaxed">
                "{testimonials[activeIndex]?.content}"
              </p>
              
              <div>
                <div className="text-white font-semibold">{testimonials[activeIndex]?.name}</div>
                <div className="text-navy-400 text-sm">{testimonials[activeIndex]?.role}</div>
                <div className="inline-flex items-center gap-1.5 mt-2 text-xs text-primary-400">
                  <span>📚</span>
                  <span>Completed: {testimonials[activeIndex]?.course}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2 text-navy-400 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === activeIndex
                      ? 'bg-primary-400 scale-125'
                      : 'bg-navy-600 hover:bg-navy-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-2 text-navy-400 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}