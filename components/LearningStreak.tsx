'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  achievements: string[]
}

const ACHIEVEMENTS = [
  { days: 1, emoji: '🌱', title: 'First Steps', message: 'Welcome to your learning journey!' },
  { days: 3, emoji: '🔥', title: 'Getting Warm', message: '3 day streak! Keep it up!' },
  { days: 7, emoji: '⭐', title: 'Week Warrior', message: 'A full week of learning!' },
  { days: 14, emoji: '💎', title: 'Dedicated', message: '2 weeks strong!' },
  { days: 30, emoji: '🏆', title: 'Monthly Master', message: 'A whole month! Incredible!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showAchievement, setShowAchievement] = useState<typeof ACHIEVEMENTS[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('learning-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Same day, just load data
        setStreakData(data)
        return
      } else if (lastVisitDate === yesterdayString) {
        // Consecutive day! Increment streak
        data.currentStreak += 1
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
        
        // Check for new achievement
        const newAchievement = ACHIEVEMENTS.find(
          a => a.days === data.currentStreak && !data.achievements.includes(a.title)
        )
        
        if (newAchievement) {
          data.achievements.push(newAchievement.title)
          setShowAchievement(newAchievement)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        // Streak broken, reset
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisit = new Date().toISOString()
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        lastVisit: new Date().toISOString(),
        totalVisits: 1,
        achievements: ['First Steps']
      }
      setShowAchievement(ACHIEVEMENTS[0])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
    
    localStorage.setItem('learning-streak', JSON.stringify(data))
    setStreakData(data)
  }, [])

  if (!streakData) return null

  const streakEmoji = streakData.currentStreak >= 30 ? '🏆' :
                      streakData.currentStreak >= 14 ? '💎' :
                      streakData.currentStreak >= 7 ? '⭐' :
                      streakData.currentStreak >= 3 ? '🔥' : '🌱'

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFE66D'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievement && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="text-6xl mb-4 animate-bounce-slow">{showAchievement.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
            <p className="text-primary-400 text-lg font-semibold mb-2">{showAchievement.title}</p>
            <p className="text-navy-300 mb-6">{showAchievement.message}</p>
            <button
              onClick={() => setShowAchievement(null)}
              className="btn-primary"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-pulse-slow">{streakEmoji}</span>
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">
                    {streakData.currentStreak} Day Streak!
                  </div>
                  <div className="text-navy-400 text-xs">
                    {streakData.totalVisits} total visits
                  </div>
                </div>
              </div>
              <svg 
                className={`w-4 h-4 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <Link 
              href="/courses" 
              className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
            >
              Continue Learning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Expanded View */}
          {isExpanded && (
            <div className="pb-4 animate-slide-down">
              <div className="bg-navy-800/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Your Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {ACHIEVEMENTS.map((achievement) => {
                    const earned = streakData.achievements.includes(achievement.title)
                    return (
                      <div
                        key={achievement.title}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                          earned 
                            ? 'bg-primary-500/10 border-primary-500/30 text-white' 
                            : 'bg-navy-900/50 border-navy-700 text-navy-500'
                        }`}
                        title={earned ? `Earned: ${achievement.message}` : `Reach ${achievement.days} days to unlock`}
                      >
                        <span className={earned ? '' : 'grayscale opacity-50'}>{achievement.emoji}</span>
                        <span className="text-sm font-medium">{achievement.title}</span>
                        {earned && (
                          <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}