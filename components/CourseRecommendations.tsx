'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseRecommendationsProps {
  courses: Course[]
}

const learnerTypes = [
  { id: 'beginner', label: '🌱 Just Starting', description: 'New to coding' },
  { id: 'intermediate', label: '🚀 Growing Skills', description: 'Know the basics' },
  { id: 'advanced', label: '⚡ Level Up', description: 'Ready for advanced topics' },
]

export default function CourseRecommendations({ courses }: CourseRecommendationsProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  const getRecommendedCourses = () => {
    if (!selectedType) return []
    
    return courses
      .filter((course) => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || 'beginner'
        if (selectedType === 'beginner') return difficulty === 'beginner'
        if (selectedType === 'intermediate') return difficulty === 'intermediate'
        if (selectedType === 'advanced') return difficulty === 'advanced'
        return true
      })
      .slice(0, 3)
  }

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    setIsRevealed(false)
    setTimeout(() => setIsRevealed(true), 100)
  }

  const recommendedCourses = getRecommendedCourses()

  return (
    <div className="bg-gradient-to-br from-navy-900/80 to-navy-950 rounded-2xl border border-navy-700/50 p-8 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 px-4 py-2 rounded-full mb-4">
            <span className="text-xl">🎯</span>
            <span className="text-primary-400 text-sm font-medium">Personalized for You</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            What should you learn next?
          </h2>
          <p className="text-navy-400">
            Tell us where you are in your journey, and we'll recommend the perfect course
          </p>
        </div>

        {/* Learner Type Selection */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {learnerTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`px-6 py-4 rounded-xl border transition-all duration-300 text-left sm:text-center ${
                selectedType === type.id
                  ? 'bg-primary-500/20 border-primary-500/50 shadow-lg shadow-primary-500/10'
                  : 'bg-navy-800/50 border-navy-700 hover:border-navy-600'
              }`}
            >
              <div className="text-2xl mb-1">{type.label.split(' ')[0]}</div>
              <div className={`font-medium ${selectedType === type.id ? 'text-white' : 'text-navy-300'}`}>
                {type.label.split(' ').slice(1).join(' ')}
              </div>
              <div className="text-xs text-navy-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>

        {/* Recommended Courses */}
        {selectedType && (
          <div className={`transition-all duration-500 ${isRevealed ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            {recommendedCourses.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold text-white text-center mb-6">
                  Perfect courses for you ✨
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group bg-navy-800/50 rounded-xl p-4 border border-navy-700/50 hover:border-primary-500/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Course Thumbnail */}
                      <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-navy-700">
                        {course.metadata?.thumbnail ? (
                          <img
                            src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">📚</span>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2 text-sm">
                        {course.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-navy-400">
                        {course.metadata?.lessons && (
                          <span>{course.metadata.lessons.length} lessons</span>
                        )}
                        {course.metadata?.is_free && (
                          <span className="text-primary-400 font-medium">FREE</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-6">
                  <Link 
                    href="/courses" 
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    See all courses
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center text-navy-400 py-8">
                <span className="text-4xl mb-4 block">🔍</span>
                <p>No courses found for this level yet.</p>
                <Link href="/courses" className="text-primary-400 hover:underline mt-2 inline-block">
                  Browse all courses
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* No selection prompt */}
        {!selectedType && (
          <div className="text-center text-navy-400 py-4">
            <span className="text-2xl">👆</span>
            <p className="mt-2">Select your experience level above to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}