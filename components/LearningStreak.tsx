'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
}

const LEARNING_TIPS = [
  { icon: '🎯', tip: 'Focus on one concept at a time. Mastery comes from depth, not breadth.' },
  { icon: '⏰', tip: 'The Pomodoro Technique: 25 minutes of focused learning, then a 5-minute break.' },
  { icon: '📝', tip: 'Take notes by hand — studies show it improves retention by 34%.' },
  { icon: '🔄', tip: 'Spaced repetition: Review material at increasing intervals for long-term memory.' },
  { icon: '💡', tip: 'Teach what you learn to someone else. It\'s the best way to solidify knowledge.' },
  { icon: '🌙', tip: 'Sleep consolidates memory. Review key concepts before bed for better retention.' },
  { icon: '🏃', tip: 'A short walk before studying increases focus and creative problem-solving.' },
  { icon: '🎵', tip: 'Instrumental music can help focus. Try lo-fi beats or classical while coding.' },
  { icon: '🧩', tip: 'Break complex problems into smaller pieces. Solve them one at a time.' },
  { icon: '🌟', tip: 'Celebrate small wins! Completing a lesson is an achievement worth acknowledging.' },
  { icon: '📚', tip: 'Active recall beats passive reading. Quiz yourself as you learn.' },
  { icon: '🤔', tip: 'Confusion is part of learning. Embrace the struggle — it means you\'re growing.' },
  { icon: '⚡', tip: 'Practice coding every day, even if just for 15 minutes. Consistency beats intensity.' },
  { icon: '🔍', tip: 'Debug by explaining your code line-by-line. The "rubber duck" method works!' },
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [dailyTip, setDailyTip] = useState<{ icon: string; tip: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    // Get stored data
    const stored = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (stored) {
      data = JSON.parse(stored)
      const lastVisit = new Date(data.lastVisitDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisit === today) {
        // Already visited today, no changes needed
      } else if (lastVisit === yesterday) {
        // Continuing streak!
        data.currentStreak += 1
        data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
        data.totalVisits += 1
        data.lastVisitDate = today
      } else {
        // Streak broken
        data.currentStreak = 1
        data.totalVisits += 1
        data.lastVisitDate = today
      }
    } else {
      // First visit
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1
      }
    }
    
    localStorage.setItem('learnhub-streak', JSON.stringify(data))
    setStreakData(data)
    
    // Set daily tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(LEARNING_TIPS[dayOfYear % LEARNING_TIPS.length])
    
    // Animate in
    setTimeout(() => setIsVisible(true), 500)
    setTimeout(() => setShowTip(true), 1000)
  }, [])

  if (!streakData) return null

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '🌱'
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary learner!'
    if (streak >= 14) return 'On fire!'
    if (streak >= 7) return 'Crushing it!'
    if (streak >= 3) return 'Building momentum!'
    return 'Great start!'
  }

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-purple-500/10 border border-navy-700/50 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-primary-500/25 animate-pulse">
                {getStreakEmoji(streakData.currentStreak)}
              </div>
              {streakData.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-navy-900 animate-bounce">
                  {streakData.currentStreak}
                </div>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {streakData.currentStreak} Day Streak
              </div>
              <div className="text-navy-400 text-sm">
                {getStreakMessage(streakData.currentStreak)}
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-xl font-bold text-white">{streakData.longestStreak}</div>
              <div className="text-navy-500 text-xs uppercase tracking-wide">Best Streak</div>
            </div>
            <div className="w-px bg-navy-700" />
            <div>
              <div className="text-xl font-bold text-white">{streakData.totalVisits}</div>
              <div className="text-navy-500 text-xs uppercase tracking-wide">Total Visits</div>
            </div>
          </div>
        </div>
        
        {/* Daily Tip */}
        {dailyTip && (
          <div className={`mt-6 pt-6 border-t border-navy-700/50 transition-all duration-700 ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{dailyTip.icon}</span>
              <div>
                <div className="text-xs uppercase tracking-wide text-primary-400 font-medium mb-1">
                  💡 Daily Learning Tip
                </div>
                <p className="text-navy-200 text-sm leading-relaxed">
                  {dailyTip.tip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}