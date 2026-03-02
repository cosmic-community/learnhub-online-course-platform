'use client'

import { useState, useEffect } from 'react'
import ConfettiExplosion from './ConfettiExplosion'

interface LearningJourneyProps {
  totalCourses: number
  totalCategories: number
}

interface StreakData {
  currentStreak: number
  lastVisit: string
  totalVisits: number
  milestonesReached: number[]
}

const MILESTONES = [1, 3, 7, 14, 30, 60, 100]

export default function LearningJourney({ totalCourses, totalCategories }: LearningJourneyProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastVisit: '',
    totalVisits: 0,
    milestonesReached: []
  })
  const [showConfetti, setShowConfetti] = useState(false)
  const [newMilestone, setNewMilestone] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('learnhub-journey')
    const today = new Date().toDateString()
    
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const lastDate = new Date(data.lastVisit).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (lastDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (lastDate === yesterday) {
        // Continuing streak!
        const newStreak = data.currentStreak + 1
        const newData: StreakData = {
          currentStreak: newStreak,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          milestonesReached: data.milestonesReached
        }
        
        // Check for new milestone
        const milestone = MILESTONES.find(m => m === newStreak && !data.milestonesReached.includes(m))
        if (milestone) {
          newData.milestonesReached = [...data.milestonesReached, milestone]
          setNewMilestone(milestone)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewMilestone(null)
          }, 4000)
        }
        
        setStreakData(newData)
        localStorage.setItem('learnhub-journey', JSON.stringify(newData))
      } else {
        // Streak broken, start fresh
        const newData: StreakData = {
          currentStreak: 1,
          lastVisit: today,
          totalVisits: data.totalVisits + 1,
          milestonesReached: data.milestonesReached
        }
        setStreakData(newData)
        localStorage.setItem('learnhub-journey', JSON.stringify(newData))
      }
    } else {
      // First visit ever!
      const newData: StreakData = {
        currentStreak: 1,
        lastVisit: today,
        totalVisits: 1,
        milestonesReached: [1]
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-journey', JSON.stringify(newData))
      setNewMilestone(1)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewMilestone(null)
      }, 4000)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const nextMilestone = MILESTONES.find(m => m > streakData.currentStreak) || MILESTONES[MILESTONES.length - 1]
  const progress = Math.min((streakData.currentStreak / nextMilestone) * 100, 100)

  return (
    <section className="py-16 relative overflow-hidden">
      {showConfetti && <ConfettiExplosion />}
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Learning Journey 🚀
          </h2>
          <p className="text-navy-400">
            Track your progress and build your learning streak
          </p>
        </div>

        {/* Milestone Achievement Popup */}
        {newMilestone && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-center shadow-2xl transform animate-bounce-in">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {newMilestone === 1 ? 'Welcome!' : 'Milestone Reached!'}
              </h3>
              <p className="text-primary-100">
                {newMilestone === 1 
                  ? "You've started your learning journey!" 
                  : `Amazing! ${newMilestone} day streak!`}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Streak Card */}
          <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-navy-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.51} 251`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <span className="text-3xl">🔥</span>
                  <div className="text-2xl font-bold text-white">{streakData.currentStreak}</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Daily Streak</h3>
            <p className="text-navy-400 text-sm">
              {nextMilestone - streakData.currentStreak} days to next milestone
            </p>
          </div>

          {/* Total Visits Card */}
          <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-navy-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient2)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(streakData.totalVisits * 2.51, 251)} 251`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <span className="text-3xl">📚</span>
                  <div className="text-2xl font-bold text-white">{streakData.totalVisits}</div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Visits</h3>
            <p className="text-navy-400 text-sm">
              Keep coming back to learn more!
            </p>
          </div>

          {/* Badges Card */}
          <div className="card p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">
                {MILESTONES.slice(0, 6).map((milestone) => (
                  <div
                    key={milestone}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      streakData.milestonesReached.includes(milestone)
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/30 scale-110'
                        : 'bg-navy-800 text-navy-500'
                    }`}
                  >
                    {milestone}
                  </div>
                ))}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Badges Earned</h3>
            <p className="text-navy-400 text-sm">
              {streakData.milestonesReached.length} of {MILESTONES.length} unlocked
            </p>
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-8 text-center">
          <p className="text-navy-300 italic">
            {streakData.currentStreak >= 7 
              ? "🌟 You're on fire! Keep up the amazing work!" 
              : streakData.currentStreak >= 3 
                ? "💪 Great momentum! You're building a solid habit." 
                : "🎯 Every expert was once a beginner. Keep learning!"}
          </p>
        </div>
      </div>
    </section>
  )
}