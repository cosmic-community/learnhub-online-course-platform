'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Course, Category } from '@/types'

interface LearningPathRecommenderProps {
  courses: Course[]
  categories: Category[]
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | null
type Interest = string | null

export default function LearningPathRecommender({ courses, categories }: LearningPathRecommenderProps) {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(null)
  const [interest, setInterest] = useState<Interest>(null)
  const [showResults, setShowResults] = useState(false)

  const recommendedCourses = useMemo(() => {
    if (!skillLevel || !interest) return []

    return courses
      .filter(course => {
        const difficulty = course.metadata?.difficulty?.value?.toLowerCase() || 
                          course.metadata?.difficulty?.key?.toLowerCase() || ''
        const matchesLevel = difficulty === skillLevel || 
                            (skillLevel === 'beginner' && difficulty === '') ||
                            (skillLevel === 'intermediate' && ['beginner', 'intermediate'].includes(difficulty))
        
        const courseCategories = course.metadata?.categories || []
        const matchesInterest = courseCategories.some((cat: Category) => cat.slug === interest)

        return matchesLevel || matchesInterest
      })
      .sort((a, b) => {
        // Prioritize exact matches
        const aDifficulty = a.metadata?.difficulty?.value?.toLowerCase() || ''
        const bDifficulty = b.metadata?.difficulty?.value?.toLowerCase() || ''
        
        if (aDifficulty === skillLevel && bDifficulty !== skillLevel) return -1
        if (bDifficulty === skillLevel && aDifficulty !== skillLevel) return 1
        return 0
      })
      .slice(0, 3)
  }, [courses, skillLevel, interest])

  const handleFindPath = () => {
    if (skillLevel && interest) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setSkillLevel(null)
    setInterest(null)
    setShowResults(false)
  }

  const skillLevels = [
    { id: 'beginner', label: 'Beginner', emoji: '🌱', description: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', emoji: '🌿', description: 'Some experience' },
    { id: 'advanced', label: 'Advanced', emoji: '🌳', description: 'Ready for challenges' },
  ]

  if (showResults) {
    return (
      <div className="card p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Learning Path</h3>
            <p className="text-navy-400">
              Based on your {skillLevel} level and interest in {categories.find(c => c.slug === interest)?.metadata?.name || interest}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="btn-secondary text-sm"
          >
            Start Over
          </button>
        </div>

        {recommendedCourses.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                <span className="text-primary-400 font-bold">1</span>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-primary-500 to-primary-500/20 rounded-full" />
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                <span className="text-primary-400/60 font-bold">2</span>
              </div>
              <div className="flex-1 h-1 bg-primary-500/10 rounded-full" />
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                <span className="text-primary-400/60 font-bold">3</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group relative card p-6 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-primary-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  
                  {course.metadata?.thumbnail?.imgix_url && (
                    <img
                      src={`${course.metadata.thumbnail.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                      alt={course.metadata?.title || course.title}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors mb-2">
                    {course.metadata?.title || course.title}
                  </h4>
                  
                  <p className="text-navy-400 text-sm line-clamp-2 mb-3">
                    {course.metadata?.tagline || 'Start your learning journey'}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      course.metadata?.difficulty?.value?.toLowerCase() === 'beginner' ? 'badge-beginner' :
                      course.metadata?.difficulty?.value?.toLowerCase() === 'intermediate' ? 'badge-intermediate' :
                      'badge-advanced'
                    }`}>
                      {course.metadata?.difficulty?.value || 'All Levels'}
                    </span>
                    {course.metadata?.is_free && (
                      <span className="badge badge-free">Free</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/courses" className="btn-primary">
                View All Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-navy-300 mb-4">
              We&apos;re still building courses for this combination. Check back soon!
            </p>
            <Link href="/courses" className="btn-primary">
              Browse All Courses
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Skill Level Selection */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">1</span>
            What&apos;s your experience level?
          </h3>
          <p className="text-navy-400 text-sm mb-6 ml-10">Choose the level that best describes you</p>
          
          <div className="space-y-3 ml-10">
            {skillLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSkillLevel(level.id as SkillLevel)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                  skillLevel === level.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{level.emoji}</span>
                  <div>
                    <div className={`font-semibold ${skillLevel === level.id ? 'text-primary-400' : 'text-white'}`}>
                      {level.label}
                    </div>
                    <div className="text-navy-400 text-sm">{level.description}</div>
                  </div>
                  {skillLevel === level.id && (
                    <svg className="w-5 h-5 text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interest Selection */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">2</span>
            What do you want to learn?
          </h3>
          <p className="text-navy-400 text-sm mb-6 ml-10">Select your area of interest</p>
          
          <div className="grid grid-cols-2 gap-3 ml-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setInterest(category.slug)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-center group ${
                  interest === category.slug
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-navy-700 hover:border-navy-600 bg-navy-800/50'
                }`}
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">
                  {category.metadata?.icon || '📚'}
                </span>
                <span className={`text-sm font-medium ${interest === category.slug ? 'text-primary-400' : 'text-white'}`}>
                  {category.metadata?.name || category.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Find Path Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleFindPath}
          disabled={!skillLevel || !interest}
          className={`btn-primary text-lg px-8 py-4 ${
            (!skillLevel || !interest) ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-subtle'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Find My Learning Path
          </span>
        </button>
        {(!skillLevel || !interest) && (
          <p className="text-navy-500 text-sm mt-3">
            Select both your level and interest to continue
          </p>
        )}
      </div>
    </div>
  )
}