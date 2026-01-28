'use client'

import { useState, useEffect } from 'react'

const learningTips = [
  { emoji: '🧠', tip: "Take breaks every 25 minutes - your brain learns better with rest!" },
  { emoji: '✍️', tip: "Write notes by hand - it improves retention by 40%!" },
  { emoji: '🎯', tip: "Focus on one concept at a time for deeper understanding." },
  { emoji: '💬', tip: "Explain what you learned to someone - teaching reinforces learning!" },
  { emoji: '🌙', tip: "Review material before bed - sleep helps consolidate memories." },
  { emoji: '🔄', tip: "Space out your learning sessions for better long-term retention." },
  { emoji: '🎮', tip: "Practice coding? Build a small project to cement your skills!" },
  { emoji: '📚', tip: "Mix different topics in one session to boost problem-solving." },
  { emoji: '🏃', tip: "A quick walk before studying increases focus and creativity." },
  { emoji: '🎵', tip: "Try lo-fi music while coding - it can improve concentration!" },
]

const milestones = [
  { days: 3, badge: '🔥', title: 'On Fire!' },
  { days: 7, badge: '⭐', title: 'Week Warrior!' },
  { days: 14, badge: '🌟', title: 'Dedicated Learner!' },
  { days: 30, badge: '🏆', title: 'Month Master!' },
  { days: 100, badge: '👑', title: 'Learning Legend!' },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Burning the midnight oil'
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Start your learning journey today!"
  if (streak === 1) return "Great start! Keep the momentum going!"
  if (streak < 7) return "You're building a habit! Keep it up!"
  if (streak < 14) return "Amazing dedication! You're unstoppable!"
  if (streak < 30) return "Two weeks strong! You're a learning machine!"
  return "Incredible commitment! You inspire us all!"
}

export default function LearningStreak() {
  const [streak, setStreak] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [dailyTip, setDailyTip] = useState(learningTips[0])
  const [showMilestone, setShowMilestone] = useState(false)
  const [currentMilestone, setCurrentMilestone] = useState<typeof milestones[0] | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get or initialize streak from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    if (storedData) {
      const { lastVisit, currentStreak } = JSON.parse(storedData)
      const lastVisitDate = new Date(lastVisit).toDateString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastVisitDate === today) {
        // Already visited today
        setStreak(currentStreak)
      } else if (lastVisitDate === yesterdayString) {
        // Visited yesterday, increment streak
        const newStreak = currentStreak + 1
        setStreak(newStreak)
        localStorage.setItem('learnhub-streak', JSON.stringify({
          lastVisit: today,
          currentStreak: newStreak
        }))
        
        // Check for milestone
        const milestone = milestones.find(m => m.days === newStreak)
        if (milestone) {
          setCurrentMilestone(milestone)
          setShowMilestone(true)
          setTimeout(() => setShowMilestone(false), 5000)
        }
      } else {
        // Streak broken, start fresh
        setStreak(1)
        localStorage.setItem('learnhub-streak', JSON.stringify({
          lastVisit: today,
          currentStreak: 1
        }))
      }
    } else {
      // First visit ever
      setStreak(1)
      localStorage.setItem('learnhub-streak', JSON.stringify({
        lastVisit: today,
        currentStreak: 1
      }))
    }

    // Set daily tip based on date (consistent throughout the day)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDailyTip(learningTips[dayOfYear % learningTips.length] || learningTips[0])
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Milestone Achievement Popup */}
      {showMilestone && currentMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-primary-500/50 rounded-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in shadow-2xl shadow-primary-500/20">
            <div className="text-7xl mb-4 animate-pulse">{currentMilestone.badge}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentMilestone.title}</h3>
            <p className="text-navy-300 mb-4">
              🎉 {currentMilestone.days} day streak achieved!
            </p>
            <button
              onClick={() => setShowMilestone(false)}
              className="btn-primary"
            >
              Keep Learning!
            </button>
          </div>
        </div>
      )}

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-navy-900/90 via-navy-800/90 to-navy-900/90 border-b border-navy-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Greeting and Streak */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounce">👋</span>
                <span className="text-navy-200 text-sm sm:text-base">
                  {getGreeting()}, learner!
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-navy-800/50 rounded-full px-4 py-1.5 border border-navy-700/50">
                <span className="text-xl">{streak >= 3 ? '🔥' : '📖'}</span>
                <span className="text-white font-semibold">{streak}</span>
                <span className="text-navy-400 text-sm">day streak</span>
              </div>
            </div>

            {/* Daily Tip Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTip(!showTip)}
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                <span className="text-lg">{dailyTip.emoji}</span>
                <span className="hidden sm:inline">Daily Tip</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showTip ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setIsVisible(false)}
                className="text-navy-500 hover:text-navy-300 transition-colors p-1"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expandable Tip Section */}
          {showTip && (
            <div className="mt-3 pt-3 border-t border-navy-700/50 animate-slide-down">
              <div className="flex items-start gap-3 bg-navy-800/30 rounded-lg p-3">
                <span className="text-2xl flex-shrink-0">{dailyTip.emoji}</span>
                <div>
                  <p className="text-navy-200 text-sm">{dailyTip.tip}</p>
                  <p className="text-navy-500 text-xs mt-1">
                    {getMotivationalMessage(streak)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}