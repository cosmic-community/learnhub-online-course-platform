'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/types'

interface LearningPathSuggestionProps {
  categories: Category[]
}

const skillLevels = [
  { id: 'beginner', label: 'Just Starting', emoji: '🌱', description: 'New to tech' },
  { id: 'intermediate', label: 'Growing', emoji: '🌿', description: 'Some experience' },
  { id: 'advanced', label: 'Leveling Up', emoji: '🌳', description: 'Ready for depth' }
]

const learningGoals = [
  { id: 'career', label: 'Career Change', emoji: '💼' },
  { id: 'skill', label: 'New Skill', emoji: '🎯' },
  { id: 'hobby', label: 'Personal Interest', emoji: '✨' },
  { id: 'project', label: 'Build a Project', emoji: '🚀' }
]

export default function LearningPathSuggestion({ categories }: LearningPathSuggestionProps) {
  const [step, setStep] = useState<'level' | 'goal' | 'result'>('level')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId)
    setIsAnimating(true)
    setTimeout(() => {
      setStep('goal')
      setIsAnimating(false)
    }, 300)
  }

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId)
    setIsAnimating(true)
    setTimeout(() => {
      setStep('result')
      setIsAnimating(false)
    }, 300)
  }

  const reset = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep('level')
      setSelectedLevel(null)
      setSelectedGoal(null)
      setIsAnimating(false)
    }, 300)
  }

  // Get recommended categories based on selections
  const getRecommendedCategories = () => {
    // Simple recommendation logic - in production this could be more sophisticated
    if (selectedLevel === 'beginner') {
      return categories.filter(cat => 
        cat.metadata?.name?.toLowerCase().includes('web') || 
        cat.metadata?.name?.toLowerCase().includes('mobile') ||
        cat.slug.includes('web') ||
        cat.slug.includes('mobile')
      ).slice(0, 2)
    }
    if (selectedLevel === 'advanced') {
      return categories.filter(cat => 
        cat.metadata?.name?.toLowerCase().includes('cloud') || 
        cat.metadata?.name?.toLowerCase().includes('data') ||
        cat.slug.includes('cloud') ||
        cat.slug.includes('data')
      ).slice(0, 2)
    }
    // Return first 2 for intermediate
    return categories.slice(0, 2)
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xl">
          🧭
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Find Your Learning Path</h3>
          <p className="text-sm text-navy-400">Answer 2 quick questions</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {['level', 'goal', 'result'].map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              ['level', 'goal', 'result'].indexOf(step) >= i
                ? 'bg-primary-500'
                : 'bg-navy-700'
            }`}
          />
        ))}
      </div>

      <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        {step === 'level' && (
          <div>
            <p className="text-navy-300 mb-4">What's your current skill level?</p>
            <div className="grid gap-3">
              {skillLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelSelect(level.id)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 transition-all text-left group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{level.emoji}</span>
                  <div>
                    <span className="font-medium text-white">{level.label}</span>
                    <p className="text-sm text-navy-400">{level.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'goal' && (
          <div>
            <p className="text-navy-300 mb-4">What's your main goal?</p>
            <div className="grid grid-cols-2 gap-3">
              {learningGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-700/50 border border-navy-700 hover:border-primary-500/50 transition-all group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{goal.emoji}</span>
                  <span className="font-medium text-white text-sm">{goal.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && (
          <div>
            <div className="flex items-center gap-2 text-primary-400 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Here's your personalized path!</span>
            </div>
            
            <p className="text-navy-300 text-sm mb-4">
              Based on your {skillLevels.find(l => l.id === selectedLevel)?.label.toLowerCase()} level and {learningGoals.find(g => g.id === selectedGoal)?.label.toLowerCase()} goal:
            </p>
            
            <div className="space-y-3 mb-6">
              {getRecommendedCategories().map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/30 hover:bg-navy-700/30 border border-navy-700/50 hover:border-primary-500/30 transition-all"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-lg">
                    {category.metadata?.icon || '📚'}
                  </span>
                  <div>
                    <span className="text-white font-medium">{category.metadata?.name || category.title}</span>
                    <p className="text-xs text-navy-400">Step {index + 1}</p>
                  </div>
                  <svg className="w-4 h-4 text-navy-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-2 px-4 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors text-sm"
              >
                Start Over
              </button>
              <Link
                href="/courses"
                className="flex-1 py-2 px-4 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-center transition-colors text-sm"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}