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
    name: "Sarah Chen",
    role: "Frontend Developer",
    avatar: "👩‍💻",
    content: "The Vue.js Fundamentals course completely transformed how I approach frontend development. The practical examples and real-world projects made all the difference.",
    course: "Vue.js Fundamentals",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "DevOps Engineer",
    avatar: "👨‍🔧",
    content: "AWS Fundamentals gave me the confidence to deploy production applications. The hands-on labs and clear explanations were exactly what I needed.",
    course: "AWS Fundamentals",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    avatar: "👩‍🚀",
    content: "Node.js Backend Development took my skills to the next level. I went from building simple APIs to architecting scalable microservices.",
    course: "Node.js Backend Development",
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    role: "Software Engineer",
    avatar: "👨‍💼",
    content: "The instructors really know their stuff. Every lesson felt purposeful and I could immediately apply what I learned at work.",
    course: "TypeScript Fundamentals",
    rating: 5
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of satisfied learners</p>
        </div>

        {/* Testimonial Card */}
        <div 
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === activeIndex 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                }`}
              >
                <div className="card p-8 md:p-12 text-center">
                  {/* Rating Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-navy-200 mb-8 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-navy-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>

                  {/* Course Badge */}
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-navy-800/50 rounded-full text-sm text-navy-300">
                      <span>📚</span>
                      Completed: {testimonial.course}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex 
                    ? 'w-8 h-2 bg-primary-500' 
                    : 'w-2 h-2 bg-navy-700 hover:bg-navy-600'
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