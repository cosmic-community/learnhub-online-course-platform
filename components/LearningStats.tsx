'use client'

import { useEffect, useState } from 'react'
import ProgressRing from './ProgressRing'
import AchievementBadge from './AchievementBadge'
import MotivationalQuote from './MotivationalQuote'

interface LearningStatsProps {
  totalCourses: number
  totalLessons: number
  totalInstructors: number
  totalCategories: number
}

interface Achievement {
  icon: string
  title: string
  description: string
  unlocked: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export default function LearningStats({
  totalCourses,
  totalLessons,
  totalInstructors,
  totalCategories,
}: LearningStatsProps) {
  const [mounted, setMounted] = useState(false)
  const [streakDays] = useState(7) // Simulated streak

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate simulated progress (in a real app, this would come from user data)
  const weeklyProgress = mounted ? 65 : 0
  const monthlyGoal = mounted ? 42 : 0

  // Generate achievements based on platform stats
  const achievements: Achievement[] = [
    {
      icon: '🚀',
      title: 'First Steps',
      description: 'Started your learning journey',
      unlocked: true,
      rarity: 'common',
    },
    {
      icon: '📚',
      title: 'Bookworm',
      description: 'Explored 5+ courses',
      unlocked: totalCourses >= 5,
      rarity: 'rare',
    },
    {
      icon: '🎯',
      title: 'Category Master',
      description: 'Explored all categories',
      unlocked: totalCategories >= 5,
      rarity: 'epic',
    },
    {
      icon: '⚡',
      title: 'Speed Learner',
      description: 'Complete 10 lessons',
      unlocked: totalLessons >= 10,
      rarity: 'rare',
    },
    {
      icon: '🔥',
      title: 'On Fire',
      description: 'Maintained a 7-day streak',
      unlocked: streakDays >= 7,
      rarity: 'epic',
    },
    {
      icon: '🏆',
      title: 'Champion',
      description: 'Complete all courses',
      unlocked: false,
      rarity: 'legendary',
    },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Your Learning Dashboard
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">Track Your Progress</h2>
          <p className="text-navy-400 max-w-2xl mx-auto">
            Stay motivated with your personalized learning stats and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Weekly Progress */}
            <div className="card p-6 flex flex-col items-center justify-center">
              <ProgressRing 
                progress={weeklyProgress} 
                label="Weekly Goal"
                sublabel="Keep it up!"
              />
              <div className="mt-4 text-center">
                <p className="text-navy-300 text-sm">
                  You're making great progress this week!
                </p>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-primary-400">📊</span> Platform Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Total Courses</span>
                  <span className="text-2xl font-bold text-white">{totalCourses}</span>
                </div>
                <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                    style={{ width: mounted ? '100%' : '0%' }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Total Lessons</span>
                  <span className="text-2xl font-bold text-white">{totalLessons}</span>
                </div>
                <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 delay-200"
                    style={{ width: mounted ? '100%' : '0%' }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Expert Instructors</span>
                  <span className="text-2xl font-bold text-white">{totalInstructors}</span>
                </div>
                <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000 delay-300"
                    style={{ width: mounted ? '100%' : '0%' }}
                  />
                </div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="card p-6 sm:col-span-2 bg-gradient-to-br from-orange-500/10 via-navy-900/50 to-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                    <span className="text-2xl">🔥</span> Learning Streak
                  </h3>
                  <p className="text-navy-400 text-sm">Keep the momentum going!</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                    {streakDays}
                  </div>
                  <div className="text-sm text-navy-400">days</div>
                </div>
              </div>
              {/* Streak visualization */}
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      flex-1 h-3 rounded-full transition-all duration-500
                      ${i < streakDays 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                        : 'bg-navy-800'
                      }
                    `}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-navy-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Right Column - Achievements & Quote */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-primary-400">🏅</span> Achievements
                </h3>
                <span className="text-sm text-navy-400">
                  {unlockedCount}/{achievements.length}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {achievements.map((achievement, index) => (
                  <AchievementBadge
                    key={index}
                    {...achievement}
                  />
                ))}
              </div>
            </div>

            {/* Motivational Quote */}
            <MotivationalQuote />
          </div>
        </div>
      </div>
    </section>
  )
}