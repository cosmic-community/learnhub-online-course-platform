'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer at Google',
    avatar: '👩‍💻',
    content: 'The courses here transformed my career. I went from junior developer to landing my dream job at Google. The instructors are amazing!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Full Stack Engineer',
    avatar: '👨‍💻',
    content: 'Best investment I ever made in my education. The hands-on projects and real-world examples made everything click.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Tech Lead at Spotify',
    avatar: '👩‍🎤',
    content: 'I recommend LearnHub to everyone on my team. The AWS and Node.js courses are especially excellent.',
    rating: 5,
  },
  {
    id: 4,
    name: 'James Park',
    role: 'Freelance Developer',
    avatar: '🧑‍💻',
    content: 'These courses helped me transition from a non-tech background to building apps for clients. Forever grateful!',
    rating: 5,
  },
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
    <div 
      className="relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Testimonial Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`card p-6 transition-all duration-500 ${
              index === activeIndex 
                ? 'ring-2 ring-primary-500/50 scale-[1.02]' 
                : 'opacity-70 hover:opacity-100'
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{testimonial.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-navy-200 mb-4 text-sm leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-navy-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-8 bg-primary-500'
                : 'bg-navy-700 hover:bg-navy-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}