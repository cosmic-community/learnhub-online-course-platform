'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearningData {
  streak: number
  lastVisit: string
  lessonsCompleted: number
  coursesStarted: string[]
  totalMinutesLearned: number
  milestones: string[]
}

const defaultData: LearningData = {
  streak: 0,
  lastVisit: '',
  lessonsCompleted: 0,
  coursesStarted: [],
  totalMinutesLearned: 0,
  milestones: [],
}

const MILESTONES = [
  { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', threshold: 1 },
  { id: 'five-lessons', name: 'Getting Started', description: 'Complete 5 lessons', icon: '📚', threshold: 5 },
  { id: 'ten-lessons', name: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '🌟', threshold: 10 },
  { id: 'streak-3', name: 'On Fire', description: '3 day learning streak', icon: '🔥', threshold: 3, type: 'streak' },
  { id: 'streak-7', name: 'Week Warrior', description: '7 day learning streak', icon: '💪', threshold: 7, type: 'streak' },
  { id: 'streak-30', name: 'Monthly Master', description: '30 day learning streak', icon: '👑', threshold: 30, type: 'streak' },
]

export default function LearningProgress() {
  const [data, setData] = useState<LearningData>(defaultData)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [newMilestone, setNewMilestone] = useState<typeof MILESTONES[0] | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Initialize on client only
  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('learnhub-progress')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LearningData
        setData(parsed)
      } catch {
        setData(defaultData)
      }
    }
  }, [])

  // Check and update streak on mount
  useEffect(() => {
    if (!isClient) return
    
    const today = new Date().toDateString()
    const lastVisit = data.lastVisit
    
    if (lastVisit === today) return // Already visited today
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    let newStreak = data.streak
    
    if (lastVisit === yesterdayStr) {
      // Consecutive day - increase streak
      newStreak = data.streak + 1
    } else if (lastVisit && lastVisit !== today) {
      // Streak broken - reset to 1
      newStreak = 1
    } else if (!lastVisit) {
      // First visit
      newStreak = 1
    }
    
    const updatedData = {
      ...data,
      streak: newStreak,
      lastVisit: today,
    }
    
    // Check for streak milestones
    const streakMilestones = MILESTONES.filter(m => m.type === 'streak')
    for (const milestone of streakMilestones) {
      if (newStreak >= milestone.threshold && !data.milestones.includes(milestone.id)) {
        updatedData.milestones = [...updatedData.milestones, milestone.id]
        setNewMilestone(milestone)
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          setNewMilestone(null)
        }, 3000)
        break
      }
    }
    
    setData(updatedData)
    localStorage.setItem('learnhub-progress', JSON.stringify(updatedData))
  }, [isClient, data])

  const completeLesson = useCallback((minutes: number = 15) => {
    const newLessonsCompleted = data.lessonsCompleted + 1
    const newTotalMinutes = data.totalMinutesLearned + minutes
    
    const updatedData = {
      ...data,
      lessonsCompleted: newLessonsCompleted,
      totalMinutesLearned: newTotalMinutes,
    }
    
    // Check for lesson milestones
    const lessonMilestones = MILESTONES.filter(m => !m.type)
    for (const milestone of lessonMilestones) {
      if (newLessonsCompleted >= milestone.threshold && !data.milestones.includes(milestone.id)) {
        updatedData.milestones = [...updatedData.milestones, milestone.id]
        setNewMilestone(milestone)
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          setNewMilestone(null)
        }, 3000)
        break
      }
    }
    
    setData(updatedData)
    localStorage.setItem('learnhub-progress', JSON.stringify(updatedData))
  }, [data])

  // Expose completeLesson globally for lesson pages to call
  useEffect(() => {
    if (isClient) {
      (window as unknown as { completeLessonProgress: (minutes?: number) => void }).completeLessonProgress = completeLesson
    }
  }, [isClient, completeLesson])

  if (!isClient) return null

  const earnedMilestones = MILESTONES.filter(m => data.milestones.includes(m.id))
  const nextMilestone = MILESTONES.find(m => !data.milestones.includes(m.id))
  
  const hoursLearned = Math.floor(data.totalMinutesLearned / 60)
  const remainingMinutes = data.totalMinutesLearned % 60

  return (
    <>
      {/* Celebration Modal */}
      {showCelebration && newMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-primary-500 rounded-2xl p-8 text-center max-w-sm mx-4 animate-bounce-in">
            <div className="text-6xl mb-4 animate-pulse">{newMilestone.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">🎉 Achievement Unlocked!</h3>
            <p className="text-primary-400 font-semibold text-lg mb-1">{newMilestone.name}</p>
            <p className="text-navy-300">{newMilestone.description}</p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl animate-sparkle" style={{ animationDelay: `${i * 0.1}s` }}>✨</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress Widget */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full p-3 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-bold">{data.streak}</span>
          </div>
          {data.streak >= 3 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
          )}
        </button>

        {isExpanded && (
          <div className="absolute bottom-14 right-0 w-80 bg-navy-900/95 backdrop-blur-md border border-navy-700 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600/20 to-primary-500/10 p-4 border-b border-navy-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Your Learning Journey</h3>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-navy-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {/* Streak */}
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">🔥</div>
                <div className="text-2xl font-bold text-white">{data.streak}</div>
                <div className="text-xs text-navy-400">Day Streak</div>
              </div>
              
              {/* Lessons */}
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">📖</div>
                <div className="text-2xl font-bold text-white">{data.lessonsCompleted}</div>
                <div className="text-xs text-navy-400">Lessons Done</div>
              </div>
              
              {/* Time */}
              <div className="col-span-2 bg-navy-800/50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {hoursLearned > 0 ? `${hoursLearned}h ${remainingMinutes}m` : `${remainingMinutes}m`}
                    </div>
                    <div className="text-xs text-navy-400">Total Learning Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="px-4 pb-4">
              <h4 className="text-sm font-semibold text-navy-300 mb-2">Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {earnedMilestones.map(milestone => (
                  <div 
                    key={milestone.id}
                    className="group relative"
                    title={milestone.description}
                  >
                    <span className="text-2xl filter drop-shadow-lg cursor-help">{milestone.icon}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {milestone.name}
                    </div>
                  </div>
                ))}
                {MILESTONES.filter(m => !data.milestones.includes(m.id)).map(milestone => (
                  <div 
                    key={milestone.id}
                    className="group relative"
                    title={`Locked: ${milestone.description}`}
                  >
                    <span className="text-2xl filter grayscale opacity-30 cursor-help">{milestone.icon}</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      🔒 {milestone.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Goal */}
            {nextMilestone && (
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-r from-primary-500/10 to-transparent rounded-lg p-3 border border-primary-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">{nextMilestone.icon}</span>
                    <div>
                      <span className="text-navy-300">Next: </span>
                      <span className="text-primary-400 font-medium">{nextMilestone.name}</span>
                    </div>
                  </div>
                  <p className="text-xs text-navy-400 mt-1 ml-7">{nextMilestone.description}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}