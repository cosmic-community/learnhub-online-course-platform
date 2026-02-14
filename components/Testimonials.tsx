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
    content: "LearnHub completely transformed my career. The Vue.js course was incredibly practical and I landed my dream job within 3 months!",
    course: "Vue.js Fundamentals",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "DevOps Engineer",
    avatar: "👨‍🔧",
    content: "The AWS course is phenomenal. The hands-on labs made complex concepts click instantly. Best investment in my career!",
    course: "AWS Fundamentals",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    avatar: "👩‍🎓",
    content: "I went from knowing nothing about backend to building production APIs. The Node.js course is incredibly well-structured!",
    course: "Node.js Backend Development",
    rating: 5
  },
  {
    id: 4,
    name: "James Park",
    role: "Software Architect",
    avatar: "🧑‍💼",
    content: "The instructors here are truly world-class. Real-world experience combined with excellent teaching skills!",
    course: "TypeScript Mastery",
    rating: 5
  }
]

export default function Testimonials() {
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

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 text-6xl opacity-20">❝</div>
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 rotate-180">❝</div>
      
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
        `}
      >
        {/* Stars */}
        <div className="flex gap-1 mb-4 justify-center">
          {[...Array(activeTestimonial.rating)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>⭐</span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-xl text-navy-200 text-center mb-6 leading-relaxed">
          "{activeTestimonial.content}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl shadow-lg">
            {activeTestimonial.avatar}
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">{activeTestimonial.name}</div>
            <div className="text-navy-400 text-sm">{activeTestimonial.role}</div>
            <div className="text-primary-400 text-xs mt-1">📚 {activeTestimonial.course}</div>
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
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === activeIndex 
                ? 'bg-primary-500 w-8' 
                : 'bg-navy-600 hover:bg-navy-500'
              }
            `}
            aria-label={`View testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}