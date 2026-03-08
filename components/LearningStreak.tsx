'use client'

import { useState, useEffect } from 'react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

const motivationalMessages = [
  "🚀 You're on fire! Keep the momentum going!",
  "💪 Every expert was once a beginner. Keep learning!",
  "🎯 Small progress is still progress. You've got this!",
  "⭐ Consistency is key. You're building great habits!",
  "🧠 Your brain thanks you for the workout!",
  "🏆 Champions are made through daily practice!",
  "✨ Today's learning is tomorrow's expertise!",
  "🔥 Your dedication is inspiring!",
]

export default function LearningStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Get or initialize streak data from localStorage
    const storedData = localStorage.getItem('learnhub-streak')
    const today = new Date().toDateString()
    
    let data: StreakData
    
    if (storedData) {
      data = JSON.parse(storedData)
      const lastVisitDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastVisitDate !== today) {
        // New day visit
        if (lastVisitDate === yesterday) {
          // Consecutive day - increase streak!
          data.currentStreak += 1
          data.longestStreak = Math.max(data.longestStreak, data.currentStreak)
          
          // Show confetti for milestone streaks
          if (data.currentStreak % 5 === 0 || data.currentStreak === 3) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 3000)
          }
        } else {
          // Streak broken - reset
          data.currentStreak = 1
        }
        data.lastVisit = today
        data.totalVisits += 1
        localStorage.setItem('learnhub-streak', JSON.stringify(data))
      }
    } else {
      // First visit ever
      data = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalVisits: 1,
      }
      localStorage.setItem('learnhub-streak', JSON.stringify(data))
    }
    
    setStreakData(data)
    setMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])
    
    // Animate in after a short delay
    setTimeout(() => setIsVisible(true), 500)
  }, [])

  if (!streakData) return null

  return (
    <section className="py-8 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative bg-gradient-to-r from-primary-500/10 via-navy-800/50 to-primary-500/10 border border-primary-500/20 rounded-2xl p-6 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-2xl animate-pulse-slow" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Streak Counter */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <span className="text-3xl font-bold text-white animate-bounce-subtle">
                    {streakData.currentStreak}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  🔥
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white">
                  {streakData.currentStreak === 1 ? 'Day' : 'Day'} Streak!
                </h3>
                <p className="text-navy-300 text-sm">
                  Best: {streakData.longestStreak} days • Total visits: {streakData.totalVisits}
                </p>
              </div>
            </div>
            
            {/* Motivational Message */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg text-white font-medium">
                {motivationalMessage}
              </p>
            </div>
            
            {/* Streak Milestones */}
            <div className="flex gap-2">
              {[3, 7, 14, 30].map((milestone) => (
                <div
                  key={milestone}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    streakData.currentStreak >= milestone
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110'
                      : 'bg-navy-700 text-navy-400'
                  }`}
                >
                  {milestone}
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Bar to Next Milestone */}
          <div className="mt-4 relative">
            <div className="flex justify-between text-xs text-navy-400 mb-1">
              <span>Current: {streakData.currentStreak} days</span>
              <span>Next milestone: {getNextMilestone(streakData.currentStreak)} days</span>
            </div>
            <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${calculateProgress(streakData.currentStreak)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function getNextMilestone(current: number): number {
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365]
  return milestones.find(m => m > current) || current + 30
}

function calculateProgress(current: number): number {
  const milestones = [0, 3, 7, 14, 30, 60, 90, 180, 365]
  const currentMilestoneIndex = milestones.findIndex(m => m > current) - 1
  const prevMilestone = milestones[Math.max(0, currentMilestoneIndex)] || 0
  const nextMilestone = milestones[currentMilestoneIndex + 1] || current + 30
  
  const progress = ((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100
  return Math.min(100, Math.max(0, progress))
}