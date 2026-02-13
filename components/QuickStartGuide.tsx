'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickStartGuideProps {
  courses: Course[]
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

const skillLevels: { id: SkillLevel; label: string; description: string; icon: string }[] = [
  { 
    id: 'beginner', 
    label: 'Just Starting', 
    description: 'New to coding or this topic',
    icon: '🌱'
  },
  { 
    id: 'intermediate', 
    label: 'Some Experience', 
    description: 'Know the basics, ready for more',
    icon: '🌿'
  },
  { 
    id: 'advanced', 
    label: 'Experienced', 
    description: 'Looking for advanced topics',
    icon: '🌳'
  },
]

export default function QuickStartGuide({ courses }: QuickStartGuideProps) {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLevelSelect = (level: SkillLevel) => {
    setIsAnimating(true)
    setTimeout(() => {
      setSelectedLevel(level)
      setIsAnimating(false)
    }, 150)
  }

  const getRecommendedCourses = (level: SkillLevel): Course[] => {
    const difficultyMap: Record<SkillLevel, string[]> = {
      beginner: ['Beginner', 'beginner'],
      intermediate: ['Intermediate', 'intermediate'],
      advanced: ['Advanced', 'advanced']
    }
    
    const matchingCourses = courses.filter(course => {
      const difficulty = course.metadata?.difficulty
      if (!difficulty) return false
      const difficultyValue = typeof difficulty === 'object' ? difficulty.value : difficulty
      return difficultyMap[level].includes(difficultyValue)
    })
    
    return matchingCourses.slice(0, 3)
  }

  const recommendedCourses = selectedLevel ? getRecommendedCourses(selectedLevel) : []

  return (
    <section className="py-16 bg-navy-900/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-4">
            <span>🎯</span>
            <span>Personalized for you</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Find Your Perfect Starting Point
          </h2>
          <p className="text-navy-400 max-w-xl mx-auto">
            Select your experience level and we'll recommend the best courses for you
          </p>
        </div>

        {/* Skill Level Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {skillLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                selectedLevel === level.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-navy-700 bg-navy-900/50 hover:border-navy-600 hover:bg-navy-900/70'
              }`}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {level.icon}
              </div>
              <h3 className={`font-semibold mb-1 ${
                selectedLevel === level.id ? 'text-primary-400' : 'text-white'
              }`}>
                {level.label}
              </h3>
              <p className="text-sm text-navy-400">{level.description}</p>
              
              {selectedLevel === level.id && (
                <div className="mt-3 flex items-center gap-1 text-primary-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Recommended Courses */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {selectedLevel && (
            <div className="bg-navy-900/50 border border-navy-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>✨</span>
                  <span>Recommended for You</span>
                </h3>
                <Link 
                  href={`/courses?difficulty=${selectedLevel}`}
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View all →
                </Link>
              </div>
              
              {recommendedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedCourses.map((course, index) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="p-4 bg-navy-800/50 rounded-xl hover:bg-navy-800 transition-all duration-300 group animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {course.metadata?.thumbnail && (
                        <img
                          src={`${course.metadata.thumbnail.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                          alt={course.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-1">
                        {course.title}
                      </h4>
                      <p className="text-sm text-navy-400 line-clamp-1">
                        {course.metadata?.tagline || 'Start learning today'}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-navy-500">
                        <span>{course.metadata?.lessons?.length || 0} lessons</span>
                        <span>•</span>
                        <span>{course.metadata?.estimated_hours || 0}h</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-navy-400">
                  <p>No courses found for this level yet.</p>
                  <Link href="/courses" className="text-primary-400 hover:underline mt-2 inline-block">
                    Browse all courses →
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {!selectedLevel && (
            <div className="text-center py-8 text-navy-500">
              <p>👆 Select your experience level above to get personalized recommendations</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}