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
    role: "Frontend Developer at Stripe",
    avatar: "👩‍💻",
    content: "These courses transformed my career! I went from junior to senior developer in just 8 months. The practical projects were exactly what I needed.",
    course: "Advanced React Patterns",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Tech Lead at Shopify",
    avatar: "👨‍💼",
    content: "The instructors don't just teach - they mentor. I've recommended LearnHub to my entire team. The Node.js course is exceptional.",
    course: "Node.js Backend Development",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Cloud Architect at AWS",
    avatar: "👩‍🔬",
    content: "Finally, a platform that covers real-world scenarios! The AWS course prepared me for my certification exam perfectly.",
    course: "AWS Fundamentals",
    rating: 5
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    avatar: "🚀",
    content: "As a non-technical founder, these courses helped me understand what my dev team does. Now I can make better product decisions!",
    course: "Web Development Fundamentals",
    rating: 5
  },
]

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
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const handleDotClick = (index: number) => {
    if (index === activeIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveIndex(index)
      setIsAnimating(false)
    }, 200)
  }

  const currentTestimonial = testimonials[activeIndex]

  return (
    <section className="py-20 bg-gradient-to-b from-navy-950 to-navy-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Loved by Learners</h2>
          <p className="text-navy-400">See what our students have to say</p>
        </div>

        <div className="relative">
          {/* Main testimonial card */}
          <div 
            className={`card p-8 md:p-12 text-center transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            }`}
          >
            {/* Quote icon */}
            <div className="text-6xl text-primary-500/20 mb-4">"</div>
            
            {/* Testimonial content */}
            <p className="text-xl md:text-2xl text-navy-200 mb-8 leading-relaxed">
              {currentTestimonial?.content}
            </p>

            {/* Rating stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-2xl ${
                    i < (currentTestimonial?.rating ?? 0) ? 'text-yellow-400' : 'text-navy-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Author info */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl">{currentTestimonial?.avatar}</div>
              <div className="text-left">
                <div className="font-semibold text-white">{currentTestimonial?.name}</div>
                <div className="text-sm text-navy-400">{currentTestimonial?.role}</div>
                <div className="text-xs text-primary-400 mt-1">Completed: {currentTestimonial?.course}</div>
              </div>
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

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-navy-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>10,000+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>4.9 Average Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Lifetime Access</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Certificate on Completion</span>
          </div>
        </div>
      </div>
    </section>
  )
}