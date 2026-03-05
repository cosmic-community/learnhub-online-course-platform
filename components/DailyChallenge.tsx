'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  xp: number
  link: string
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'watch',
    title: 'Watch a Lesson',
    description: 'Complete any lesson from your courses',
    icon: '📺',
    xp: 10,
    link: '/courses',
  },
  {
    id: 'explore',
    title: 'Explore New',
    description: 'Check out a category you haven\'t visited',
    icon: '🔍',
    xp: 5,
    link: '/categories',
  },
  {
    id: 'practice',
    title: 'Practice Code',
    description: 'Try the code example from any lesson',
    icon: '💻',
    xp: 15,
    link: '/courses',
  },
]

export default function DailyChallenge() {
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [totalXP, setTotalXP] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('learnhub-daily-challenges')
    const savedXP = localStorage.getItem('learnhub-total-xp')
    const today = new Date().toDateString()
    
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.date === today) {
        setCompletedChallenges(parsed.completed)
      } else {
        // Reset for new day
        localStorage.setItem('learnhub-daily-challenges', JSON.stringify({ date: today, completed: [] }))
      }
    }
    
    if (savedXP) {
      setTotalXP(parseInt(savedXP))
    }
  }, [])

  const completeChallenge = (challenge: Challenge) => {
    if (completedChallenges.includes(challenge.id)) return
    
    const newCompleted = [...completedChallenges, challenge.id]
    const newXP = totalXP + challenge.xp
    
    setCompletedChallenges(newCompleted)
    setTotalXP(newXP)
    
    localStorage.setItem('learnhub-daily-challenges', JSON.stringify({
      date: new Date().toDateString(),
      completed: newCompleted,
    }))
    localStorage.setItem('learnhub-total-xp', newXP.toString())
  }

  if (!isClient) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-48 bg-navy-800 rounded-lg"></div>
      </div>
    )
  }

  const allCompleted = completedChallenges.length === DAILY_CHALLENGES.length

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">⚡</span> Daily Challenges
        </h3>
        <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1.5 rounded-full">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-yellow-400">{totalXP} XP</span>
        </div>
      </div>

      {allCompleted && (
        <div className="mb-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
          <span className="text-2xl">🏆</span>
          <p className="text-green-400 font-semibold mt-1">All challenges complete! Amazing work!</p>
        </div>
      )}

      <div className="space-y-3">
        {DAILY_CHALLENGES.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id)
          
          return (
            <div 
              key={challenge.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-navy-800/50 border-navy-700 hover:border-primary-500/50'
              }`}
            >
              <div className={`text-2xl ${isCompleted ? 'opacity-50' : ''}`}>
                {isCompleted ? '✅' : challenge.icon}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${isCompleted ? 'text-green-400 line-through' : 'text-white'}`}>
                  {challenge.title}
                </h4>
                <p className="text-sm text-navy-400">{challenge.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                  +{challenge.xp} XP
                </span>
                
                {isCompleted ? (
                  <span className="text-green-400 text-sm font-medium px-3 py-1 bg-green-500/20 rounded-lg">
                    Done!
                  </span>
                ) : (
                  <Link 
                    href={challenge.link}
                    onClick={() => completeChallenge(challenge)}
                    className="text-sm font-medium px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
                  >
                    Start →
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}