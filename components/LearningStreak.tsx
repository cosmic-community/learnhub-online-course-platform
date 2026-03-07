'use client'

import { useState, useEffect, useCallback } from 'react'
import Confetti from './Confetti'

interface LearningStreakProps {
  totalCourses: number
  totalLessons: number
}

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisitDate: string
  totalVisits: number
  lessonsViewed: number
  minutesLearned: number
  achievements: string[]
}

const MILESTONE_STREAKS = [3, 7, 14, 30, 60, 100]
const ACHIEVEMENTS = {
  first_visit: { name: 'First Steps', emoji: '👣', description: 'Started your learning journey' },
  streak_3: { name: 'Consistency Starter', emoji: '🔥', description: '3-day learning streak' },
  streak_7: { name: 'Week Warrior', emoji: '⚡', description: '7-day learning streak' },
  streak_14: { name: 'Fortnight Focus', emoji: '🎯', description: '14-day learning streak' },
  streak_30: { name: 'Monthly Master', emoji: '🏆', description: '30-day learning streak' },
  streak_60: { name: 'Dedication Pro', emoji: '💎', description: '60-day learning streak' },
  streak_100: { name: 'Century Legend', emoji: '👑', description: '100-day learning streak' },
}

export default function LearningStreak({ totalCourses, totalLessons }: LearningStreakProps) {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  const getToday = useCallback(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const getYesterday = useCallback(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }, [])

  useEffect(() => {
    setIsClient(true)
    
    // Load existing streak data
    const savedData = localStorage.getItem('learnhub-streak')
    const today = getToday()
    const yesterday = getYesterday()

    if (savedData) {
      const data: StreakData = JSON.parse(savedData)
      
      if (data.lastVisitDate === today) {
        // Already visited today
        setStreakData(data)
      } else if (data.lastVisitDate === yesterday) {
        // Continuing streak
        const newStreak = data.currentStreak + 1
        const newLongestStreak = Math.max(newStreak, data.longestStreak)
        const newAchievements = [...data.achievements]
        
        // Check for new achievements
        let earnedAchievement: string | null = null
        MILESTONE_STREAKS.forEach(milestone => {
          const achievementKey = `streak_${milestone}`
          if (newStreak >= milestone && !newAchievements.includes(achievementKey)) {
            newAchievements.push(achievementKey)
            earnedAchievement = achievementKey
          }
        })

        const updatedData: StreakData = {
          ...data,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
          achievements: newAchievements,
        }
        
        setStreakData(updatedData)
        localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
        
        if (earnedAchievement) {
          setNewAchievement(earnedAchievement)
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewAchievement(null)
          }, 5000)
        }
      } else {
        // Streak broken, start fresh
        const updatedData: StreakData = {
          ...data,
          currentStreak: 1,
          lastVisitDate: today,
          totalVisits: data.totalVisits + 1,
        }
        setStreakData(updatedData)
        localStorage.setItem('learnhub-streak', JSON.stringify(updatedData))
      }
    } else {
      // First visit ever
      const newData: StreakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisitDate: today,
        totalVisits: 1,
        lessonsViewed: 0,
        minutesLearned: 0,
        achievements: ['first_visit'],
      }
      setStreakData(newData)
      localStorage.setItem('learnhub-streak', JSON.stringify(newData))
      
      // Welcome celebration for first visit
      setNewAchievement('first_visit')
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievement(null)
      }, 4000)
    }
  }, [getToday, getYesterday])

  if (!isClient || !streakData) {
    return null
  }

  const streakEmoji = streakData.currentStreak >= 7 ? '🔥' : streakData.currentStreak >= 3 ? '⚡' : '✨'
  const progressToNextMilestone = () => {
    const nextMilestone = MILESTONE_STREAKS.find(m => m > streakData.currentStreak) || 100
    const prevMilestone = MILESTONE_STREAKS.filter(m => m <= streakData.currentStreak).pop() || 0
    const progress = ((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    return { nextMilestone, progress: Math.min(progress, 100) }
  }

  const { nextMilestone, progress } = progressToNextMilestone()

  return (
    <>
      {showConfetti && <Confetti />}
      
      {/* Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-500/30 flex items-center gap-4">
            <span className="text-4xl">
              {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].emoji}
            </span>
            <div>
              <div className="font-bold text-lg">Achievement Unlocked!</div>
              <div className="text-primary-100">
                {ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].name}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Widget */}
      <div className="fixed top-24 right-4 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative"
        >
          <div className={`
            bg-navy-900/90 backdrop-blur-sm border border-navy-700 rounded-2xl shadow-xl
            transition-all duration-300 overflow-hidden
            ${isExpanded ? 'w-72' : 'w-auto'}
          `}>
            {/* Compact View */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <span className="text-2xl">{streakEmoji}</span>
                {streakData.currentStreak >= 3 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-lg leading-none">
                  {streakData.currentStreak}
                </div>
                <div className="text-navy-400 text-xs">day streak</div>
              </div>
              <svg 
                className={`w-4 h-4 text-navy-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Expanded View */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-navy-700/50">
                {/* Progress to next milestone */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-navy-400 mb-1">
                    <span>Progress to {nextMilestone}-day streak</span>
                    <span>{streakData.currentStreak}/{nextMilestone}</span>
                  </div>
                  <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                    <div className="text-primary-400 font-bold text-xl">{streakData.longestStreak}</div>
                    <div className="text-navy-400 text-xs">Best Streak</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-xl p-3 text-center">
                    <div className="text-green-400 font-bold text-xl">{streakData.totalVisits}</div>
                    <div className="text-navy-400 text-xs">Total Visits</div>
                  </div>
                </div>

                {/* Achievements */}
                {streakData.achievements.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-navy-400 mb-2">Achievements</div>
                    <div className="flex flex-wrap gap-2">
                      {streakData.achievements.map((achievement) => {
                        const data = ACHIEVEMENTS[achievement as keyof typeof ACHIEVEMENTS]
                        return data ? (
                          <div
                            key={achievement}
                            className="group/badge relative"
                            title={data.description}
                          >
                            <span className="text-xl cursor-pointer hover:scale-125 transition-transform inline-block">
                              {data.emoji}
                            </span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="mt-4 pt-3 border-t border-navy-700/50">
                  <div className="text-xs text-navy-400 mb-2">Platform Stats</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-300">{totalCourses} Courses</span>
                    <span className="text-navy-300">{totalLessons} Lessons</span>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="mt-4 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl p-3">
                  <p className="text-xs text-primary-300 text-center">
                    {streakData.currentStreak === 1 
                      ? "Great start! Keep coming back to build your streak! 🚀"
                      : streakData.currentStreak < 7
                      ? `${7 - streakData.currentStreak} more days to Week Warrior badge! 💪`
                      : streakData.currentStreak < 30
                      ? "Amazing dedication! You're on fire! 🔥"
                      : "Incredible! You're a learning legend! 👑"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  )
}