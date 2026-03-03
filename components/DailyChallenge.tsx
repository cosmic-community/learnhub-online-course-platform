'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'explore' | 'learn' | 'practice'
  action: string
  link: string
  xp: number
}

const dailyChallenges: Challenge[] = [
  {
    id: 'explore-category',
    title: 'Category Explorer',
    description: 'Discover a new category today',
    type: 'explore',
    action: 'Explore Categories',
    link: '/categories',
    xp: 10
  },
  {
    id: 'start-course',
    title: 'Course Starter',
    description: 'Begin your learning journey with a new course',
    type: 'learn',
    action: 'Browse Courses',
    link: '/courses',
    xp: 25
  },
  {
    id: 'meet-instructor',
    title: 'Meet an Expert',
    description: 'Learn about an instructor\'s background',
    type: 'explore',
    action: 'View Instructors',
    link: '/courses',
    xp: 15
  },
  {
    id: 'deep-dive',
    title: 'Deep Diver',
    description: 'Complete reading a full lesson',
    type: 'practice',
    action: 'Start Learning',
    link: '/courses',
    xp: 50
  }
]

export default function DailyChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    // Get a consistent daily challenge based on the date
    const today = new Date().toDateString()
    const dayIndex = new Date().getDate() % dailyChallenges.length
    const dailyChallenge = dailyChallenges[dayIndex]
    
    if (dailyChallenge) {
      setChallenge(dailyChallenge)
    }

    // Check completion status
    const completedChallenges = JSON.parse(localStorage.getItem('completed-challenges') || '{}')
    if (completedChallenges[today]) {
      setIsCompleted(true)
    }

    // Get total XP
    const xp = parseInt(localStorage.getItem('total-xp') || '0', 10)
    setTotalXP(xp)
  }, [])

  const handleComplete = () => {
    if (!challenge || isCompleted) return

    const today = new Date().toDateString()
    const completedChallenges = JSON.parse(localStorage.getItem('completed-challenges') || '{}')
    completedChallenges[today] = challenge.id
    localStorage.setItem('completed-challenges', JSON.stringify(completedChallenges))

    const newXP = totalXP + challenge.xp
    localStorage.setItem('total-xp', String(newXP))
    setTotalXP(newXP)
    setIsCompleted(true)
  }

  if (!challenge) return null

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'explore': return '🧭'
      case 'learn': return '📚'
      case 'practice': return '💪'
      default: return '⭐'
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'explore': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      case 'learn': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
      case 'practice': return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      default: return 'from-primary-500/20 to-primary-600/20 border-primary-500/30'
    }
  }

  return (
    <div className={`card p-5 bg-gradient-to-br ${getTypeColor(challenge.type)} relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(challenge.type)}</span>
            <div>
              <h3 className="font-semibold text-white text-sm">Daily Challenge</h3>
              <p className="text-xs text-navy-400">Resets at midnight</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
            <span>+{challenge.xp}</span>
            <span>XP</span>
          </div>
        </div>

        {/* Challenge Details */}
        <div className="mb-4">
          <h4 className="text-white font-medium mb-1">{challenge.title}</h4>
          <p className="text-navy-300 text-sm">{challenge.description}</p>
        </div>

        {/* Action */}
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Completed! Great job! 🎉</span>
          </div>
        ) : (
          <Link
            href={challenge.link}
            onClick={handleComplete}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {challenge.action}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}

        {/* XP Progress */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-navy-400">Total XP Earned</span>
            <span className="text-yellow-400 font-semibold">{totalXP} XP</span>
          </div>
          <div className="mt-2 h-2 bg-navy-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalXP % 100), 100)}%` }}
            />
          </div>
          <p className="text-xs text-navy-500 mt-1">
            {100 - (totalXP % 100)} XP until next level
          </p>
        </div>
      </div>
    </div>
  )
}