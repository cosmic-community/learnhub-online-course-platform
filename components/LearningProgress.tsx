'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface LearningProgressProps {
  totalCourses: number
}

interface ProgressData {
  lessonsCompleted: number
  coursesStarted: number
  streak: number
  lastVisit: string
  achievements: string[]
  totalTimeMinutes: number
}

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', requirement: 1 },
  { id: 'five_lessons', name: 'Quick Learner', icon: '📚', description: 'Complete 5 lessons', requirement: 5 },
  { id: 'ten_lessons', name: 'Knowledge Seeker', icon: '🧠', description: 'Complete 10 lessons', requirement: 10 },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3-day learning streak', requirement: 3 },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚡', description: '7-day learning streak', requirement: 7 },
  { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Learn before 8 AM', requirement: 1 },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Learn after 10 PM', requirement: 1 },
]

const DEFAULT_PROGRESS: ProgressData = {
  lessonsCompleted: 0,
  coursesStarted: 0,
  streak: 0,
  lastVisit: '',
  achievements: [],
  totalTimeMinutes: 0,
}

export default function LearningProgress({ totalCourses }: LearningProgressProps) {
  const [progress, setProgress] = useState<ProgressData>(DEFAULT_PROGRESS)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Load progress from localStorage
  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem('learnhub-progress')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProgressData
        setProgress(parsed)
        
        // Check and update streak
        const today = new Date().toDateString()
        const lastVisit = parsed.lastVisit ? new Date(parsed.lastVisit).toDateString() : ''
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        
        if (lastVisit !== today) {
          const newStreak = lastVisit === yesterday ? parsed.streak + 1 : 1
          const updatedProgress = {
            ...parsed,
            streak: newStreak,
            lastVisit: new Date().toISOString(),
          }
          setProgress(updatedProgress)
          localStorage.setItem('learnhub-progress', JSON.stringify(updatedProgress))
          
          // Check for streak achievements
          if (newStreak === 3 && !parsed.achievements.includes('streak_3')) {
            unlockAchievement('streak_3', updatedProgress)
          } else if (newStreak === 7 && !parsed.achievements.includes('streak_7')) {
            unlockAchievement('streak_7', updatedProgress)
          }
        }
        
        // Check time-based achievements
        const hour = new Date().getHours()
        if (hour < 8 && !parsed.achievements.includes('early_bird')) {
          unlockAchievement('early_bird', parsed)
        } else if (hour >= 22 && !parsed.achievements.includes('night_owl')) {
          unlockAchievement('night_owl', parsed)
        }
      } catch {
        // Invalid data, reset
        localStorage.setItem('learnhub-progress', JSON.stringify(DEFAULT_PROGRESS))
      }
    } else {
      // First visit - set initial data
      const initialProgress = {
        ...DEFAULT_PROGRESS,
        lastVisit: new Date().toISOString(),
        streak: 1,
      }
      localStorage.setItem('learnhub-progress', JSON.stringify(initialProgress))
      setProgress(initialProgress)
    }
  }, [])

  const unlockAchievement = useCallback((achievementId: string, currentProgress: ProgressData) => {
    if (currentProgress.achievements.includes(achievementId)) return
    
    const updatedProgress = {
      ...currentProgress,
      achievements: [...currentProgress.achievements, achievementId],
    }
    setProgress(updatedProgress)
    localStorage.setItem('learnhub-progress', JSON.stringify(updatedProgress))
    
    // Show celebration
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
    if (achievement) {
      setNewAchievement(achievement.name)
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }, [])

  // Demo function to simulate completing a lesson
  const simulateLessonComplete = () => {
    const newLessonsCompleted = progress.lessonsCompleted + 1
    const updatedProgress = {
      ...progress,
      lessonsCompleted: newLessonsCompleted,
      totalTimeMinutes: progress.totalTimeMinutes + Math.floor(Math.random() * 20) + 10,
    }
    
    setProgress(updatedProgress)
    localStorage.setItem('learnhub-progress', JSON.stringify(updatedProgress))
    
    // Check lesson achievements
    if (newLessonsCompleted === 1 && !progress.achievements.includes('first_lesson')) {
      unlockAchievement('first_lesson', updatedProgress)
    } else if (newLessonsCompleted === 5 && !progress.achievements.includes('five_lessons')) {
      unlockAchievement('five_lessons', updatedProgress)
    } else if (newLessonsCompleted === 10 && !progress.achievements.includes('ten_lessons')) {
      unlockAchievement('ten_lessons', updatedProgress)
    }
  }

  if (!isClient) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-navy-800/50 rounded-2xl"></div>
      </div>
    )
  }

  const unlockedAchievements = ACHIEVEMENTS.filter(a => progress.achievements.includes(a.id))
  const progressPercentage = Math.min((progress.lessonsCompleted / 20) * 100, 100)

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Achievement Notification */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-bold">Achievement Unlocked!</p>
              <p className="text-primary-100">{newAchievement}</p>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Progress Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Learning Journey</h3>
                <p className="text-navy-400 text-sm">Keep up the great work!</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-navy-300">Progress to next milestone</span>
                <span className="text-primary-400 font-medium">{progress.lessonsCompleted}/20 lessons</span>
              </div>
              <div className="h-3 bg-navy-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{progress.streak}</div>
                <div className="text-navy-400 text-xs flex items-center justify-center gap-1">
                  <span>🔥</span> Day Streak
                </div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{progress.lessonsCompleted}</div>
                <div className="text-navy-400 text-xs flex items-center justify-center gap-1">
                  <span>📚</span> Lessons
                </div>
              </div>
              <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{progress.totalTimeMinutes}</div>
                <div className="text-navy-400 text-xs flex items-center justify-center gap-1">
                  <span>⏱️</span> Minutes
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="lg:w-80 lg:border-l lg:border-navy-700 lg:pl-6">
            <h4 className="text-sm font-semibold text-navy-300 mb-3 flex items-center gap-2">
              <span>🏆</span> Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = progress.achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isUnlocked 
                        ? 'bg-primary-500/20 hover:bg-primary-500/30' 
                        : 'bg-navy-800/50 opacity-40 grayscale'
                    }`}
                    title={`${achievement.name}: ${achievement.description}`}
                  >
                    <span className="text-xl">{achievement.icon}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                        <p className="font-semibold text-white">{achievement.name}</p>
                        <p className="text-navy-400">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Demo Button */}
            <button
              onClick={simulateLessonComplete}
              className="mt-4 w-full btn-secondary text-sm py-2"
            >
              ✨ Complete Demo Lesson
            </button>
          </div>
        </div>
      </div>
    </>
  )
}