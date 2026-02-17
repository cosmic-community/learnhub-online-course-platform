'use client'

import { useState, useEffect } from 'react'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: "The courses here transformed my career. I went from knowing basic HTML to building full-stack applications in just 6 months!",
    rating: 5
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    avatar: '👨‍💻',
    content: "The instructors are incredible. They explain complex concepts in a way that actually makes sense. Best investment I've made in my education.",
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    avatar: '👩‍🎓',
    content: "I took the AWS course to understand our tech stack better. Now I can have meaningful conversations with my engineering team!",
    rating: 5
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Startup Founder',
    avatar: '🧑‍💼',
    content: "These courses gave me the technical foundation to build my MVP without hiring expensive developers. Game changer!",
    rating: 5
  }
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
          <p className="text-navy-400">Join thousands of satisfied learners</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="card p-8 md:p-12 text-center">
            <div className="text-5xl mb-6">{testimonials[activeIndex].avatar}</div>
            
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
              "{testimonials[activeIndex].content}"
            </blockquote>

            <div>
              <p className="text-white font-semibold">{testimonials[activeIndex].name}</p>
              <p className="text-navy-400 text-sm">{testimonials[activeIndex].role}</p>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
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
      </div>
    </section>
  )
}