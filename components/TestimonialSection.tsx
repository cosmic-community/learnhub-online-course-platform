'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "Tech Startup",
    avatar: "👩‍💻",
    quote: "LearnHub's courses helped me transition from a designer to a full-stack developer. The project-based learning approach made all the difference.",
    rating: 5,
    course: "React Fundamentals"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Software Engineer",
    company: "Fortune 500",
    avatar: "👨‍💼",
    quote: "The instructors are industry veterans who share real-world insights you won't find in textbooks. Highly recommended!",
    rating: 5,
    course: "Node.js Backend Development"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "SaaS Company",
    avatar: "👩‍🔬",
    quote: "Even as a non-developer, I found the courses accessible and practical. Now I can communicate better with my engineering team.",
    rating: 5,
    course: "TypeScript Masterclass"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Freelance Developer",
    company: "Self-employed",
    avatar: "👨‍🎨",
    quote: "The AWS course gave me the confidence to handle enterprise-level projects. My client base has grown significantly since.",
    rating: 5,
    course: "AWS Fundamentals"
  }
]

export default function TestimonialSection() {
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

  const activeTestimonial = testimonials[activeIndex]
  if (!activeTestimonial) return null

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of satisfied learners</p>
        </div>

        <div className="relative">
          {/* Quote decoration */}
          <div className="absolute -top-8 -left-4 text-8xl text-primary-500/10 font-serif select-none">
            "
          </div>
          
          <div 
            className={`card p-8 md:p-12 text-center transition-all duration-300 ${
              isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-4xl shadow-lg shadow-primary-500/25">
              {activeTestimonial.avatar}
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(activeTestimonial.rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-white font-medium mb-6 leading-relaxed">
              "{activeTestimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="space-y-1">
              <div className="text-white font-semibold">{activeTestimonial.name}</div>
              <div className="text-navy-400 text-sm">
                {activeTestimonial.role} at {activeTestimonial.company}
              </div>
              <div className="inline-flex items-center gap-1 text-primary-400 text-sm mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Completed: {activeTestimonial.course}
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
                    setActiveIndex(index)
                    setIsAnimating(false)
                  }, 300)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-primary-500' 
                    : 'bg-navy-600 hover:bg-navy-500'
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