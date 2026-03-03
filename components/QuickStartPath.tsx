'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/types'

interface QuickStartPathProps {
  categories: Category[]
}

const skillLevels = [
  { id: 'beginner', label: 'Just Starting', emoji: '🌱', description: 'New to programming' },
  { id: 'intermediate', label: 'Some Experience', emoji: '🌿', description: 'Built a few projects' },
  { id: 'advanced', label: 'Experienced', emoji: '🌳', description: 'Looking to specialize' }
]

export default function QuickStartPath({ categories }: QuickStartPathProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [showCategories, setShowCategories] = useState(false)

  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(levelId)
    setTimeout(() => setShowCategories(true), 300)
  }

  const resetSelection = () => {
    setShowCategories(false)
    setTimeout(() => setSelectedLevel(null), 200)
  }

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="text-2xl">🧭</span>
        <h2 className="text-2xl font-bold text-white">Quick Start Guide</h2>
      </div>
      <p className="text-navy-400 mb-8">Tell us about your experience level and we'll help you find the perfect starting point</p>
      
      {!selectedLevel ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {skillLevels.map((level, index) => (
            <button
              key={level.id}
              onClick={() => handleLevelSelect(level.id)}
              className="card p-6 text-center hover:border-primary-500/50 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {level.emoji}
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                {level.label}
              </h3>
              <p className="text-sm text-navy-400">
                {level.description}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className={`transition-all duration-500 ${showCategories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium">
              {skillLevels.find(l => l.id === selectedLevel)?.emoji} {skillLevels.find(l => l.id === selectedLevel)?.label}
            </span>
            <button
              onClick={resetSelection}
              className="text-navy-400 hover:text-white text-sm underline transition-colors"
            >
              Change
            </button>
          </div>
          
          <p className="text-white mb-6">
            {selectedLevel === 'beginner' && "Start with fundamentals! These categories are perfect for newcomers:"}
            {selectedLevel === 'intermediate' && "Ready to level up! Dive deeper into these areas:"}
            {selectedLevel === 'advanced' && "Master these advanced topics to become an expert:"}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.slice(0, 4).map((category, index) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-primary-500/50 text-white transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <span>{category.metadata?.icon || '📂'}</span>
                <span>{category.metadata?.name || category.title}</span>
                <svg className="w-4 h-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
          
          <div className="mt-6">
            <Link 
              href="/courses" 
              className="text-primary-400 hover:text-primary-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
            >
              Or browse all courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}