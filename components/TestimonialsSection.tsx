'use client'

import { useState, useEffect } from 'react'
import TestimonialCard from './TestimonialCard'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '',
    content: 'The React course completely transformed my career. The hands-on projects and clear explanations made complex concepts easy to understand. I landed my dream job within 3 months!',
    rating: 5,
    course: 'React Fundamentals'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Full Stack Engineer',
    avatar: '',
    content: 'Best investment in my career. The Node.js course taught me production-ready patterns I use daily. The instructor\'s experience really shows in the quality of content.',
    rating: 5,
    course: 'Node.js Backend'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Cloud Architect',
    avatar: '',
    content: 'AWS Fundamentals gave me the confidence to lead our company\'s cloud migration. The practical labs and real-world scenarios were invaluable.',
    rating: 5,
    course: 'AWS Fundamentals'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Software Engineer',
    avatar: '',
    content: 'Vue.js course is phenomenal! Rachel Kim explains concepts so clearly. I went from zero Vue experience to building production apps in weeks.',
    rating: 5,
    course: 'Vue.js Fundamentals'
  },
  {
    id: 5,
    name: 'Alex Thompson',
    role: 'Junior Developer',
    avatar: '',
    content: 'As a self-taught developer, these courses filled in all my knowledge gaps. The structured curriculum and supportive community made all the difference.',
    rating: 5,
    course: 'TypeScript Mastery'
  },
  {
    id: 6,
    name: 'Priya Patel',
    role: 'Tech Lead',
    avatar: '',
    content: 'I use LearnHub to upskill my entire team. The quality is consistent across all courses, and the progress tracking helps me monitor team development.',
    rating: 5,
    course: 'Multiple Courses'
  }
]

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemsToShow = 3

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (testimonials.length - itemsToShow + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">Student Success Stories</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">What Our Learners Say</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Join thousands of satisfied students who have transformed their careers through our courses
          </p>
        </div>

        {/* Desktop: Show 3 cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {testimonials.slice(activeIndex, activeIndex + itemsToShow).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile/Tablet: Show 1 card */}
        <div className="lg:hidden">
          <TestimonialCard testimonial={testimonials[activeIndex] || testimonials[0]} />
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: testimonials.length - itemsToShow + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-primary-500 w-6' : 'bg-navy-700 hover:bg-navy-600'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Social proof stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-xl bg-navy-900/30 border border-navy-800">
            <div className="text-3xl font-bold text-primary-400">4.9</div>
            <div className="text-sm text-navy-400 mt-1">Average Rating</div>
          </div>
          <div className="p-6 rounded-xl bg-navy-900/30 border border-navy-800">
            <div className="text-3xl font-bold text-primary-400">15K+</div>
            <div className="text-sm text-navy-400 mt-1">Students Enrolled</div>
          </div>
          <div className="p-6 rounded-xl bg-navy-900/30 border border-navy-800">
            <div className="text-3xl font-bold text-primary-400">94%</div>
            <div className="text-sm text-navy-400 mt-1">Completion Rate</div>
          </div>
          <div className="p-6 rounded-xl bg-navy-900/30 border border-navy-800">
            <div className="text-3xl font-bold text-primary-400">89%</div>
            <div className="text-sm text-navy-400 mt-1">Career Advancement</div>
          </div>
        </div>
      </div>
    </section>
  )
}