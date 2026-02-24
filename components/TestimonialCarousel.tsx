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
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: 'The React course completely transformed my career. Within 3 months of completing it, I landed my dream job as a frontend developer!',
    rating: 5,
    course: 'Advanced React Patterns'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Full Stack Engineer',
    avatar: '👨‍💻',
    content: 'The instructors are world-class. They explain complex concepts in such an approachable way. Best investment I\'ve made in my career.',
    rating: 5,
    course: 'Node.js Backend Development'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    avatar: '👩‍🎨',
    content: 'I switched careers from marketing to tech using LearnHub courses. The structured curriculum and hands-on projects made all the difference.',
    rating: 5,
    course: 'UI/UX Design Fundamentals'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'DevOps Engineer',
    avatar: '🧑‍💼',
    content: 'The AWS course was incredibly comprehensive. I passed my certification exam on the first try! The practice labs were invaluable.',
    rating: 5,
    course: 'AWS Fundamentals'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Software Architect',
    avatar: '👩‍🔬',
    content: 'I\'ve taken courses on many platforms, but LearnHub stands out for its quality and depth. The TypeScript course is a masterpiece.',
    rating: 5,
    course: 'TypeScript Mastery'
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

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-navy-700'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div className="relative">
      {/* Main Testimonial Display */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="w-full flex-shrink-0 px-4"
            >
              <div className="max-w-3xl mx-auto">
                <div className="card p-8 md:p-12 text-center">
                  {/* Avatar */}
                  <div className="text-6xl mb-6">{testimonial.avatar}</div>
                  
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                  
                  {/* Author Info */}
                  <div>
                    <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                    <div className="text-navy-400">{testimonial.role}</div>
                    <div className="text-primary-400 text-sm mt-1">
                      Completed: {testimonial.course}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
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
        onClick={() => goToSlide((activeIndex - 1 + testimonials.length) % testimonials.length)}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-navy-800/80 hover:bg-navy-700 text-white transition-colors hidden md:block"
        aria-label="Previous testimonial"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((activeIndex + 1) % testimonials.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-navy-800/80 hover:bg-navy-700 text-white transition-colors hidden md:block"
        aria-label="Next testimonial"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}