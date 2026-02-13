'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Confetti from './Confetti'

interface WelcomeHeroProps {
  coursesCount: number
  instructorsCount: number
  categoriesCount: number
}

interface UserProgress {
  name: string
  visitCount: number
  lastVisit: string
  achievements: string[]
  streak: number
}

const ACHIEVEMENTS = {
  first_visit: { id: 'first_visit', name: 'Welcome Aboard', icon: '🚀', description: 'Started your learning journey' },
  explorer: { id: 'explorer', name: 'Explorer', icon: '🔍', description: 'Visited 3 different pages' },
  regular: { id: 'regular', name: 'Regular Learner', icon: '📚', description: 'Visited 5 times' },
  streak_3: { id: 'streak_3', name: 'On Fire', icon: '🔥', description: 'Visited 3 days in a row' },
  night_owl: { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Learning after midnight' },
  early_bird: { id: 'early_bird', name: 'Early Bird', icon: '🐦', description: 'Learning before 7am' },
}

export default function WelcomeHero({ coursesCount, instructorsCount, categoriesCount }: WelcomeHeroProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [showNameInput, setShowNameInput] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [animatedCourses, setAnimatedCourses] = useState(0)
  const [animatedInstructors, setAnimatedInstructors] = useState(0)
  const [animatedCategories, setAnimatedCategories] = useState(0)

  useEffect(() => {
    // Load or initialize progress
    const stored = localStorage.getItem('learnhub_progress')
    const today = new Date().toDateString()
    
    if (stored) {
      const existingProgress: UserProgress = JSON.parse(stored)
      const lastVisitDate = new Date(existingProgress.lastVisit).toDateString()
      const isNewDay = lastVisitDate !== today
      
      let newStreak = existingProgress.streak
      const newAchievements = [...existingProgress.achievements]
      
      if (isNewDay) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (lastVisitDate === yesterday.toDateString()) {
          newStreak++
        } else {
          newStreak = 1
        }
      }
      
      // Check for new achievements
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 5 && !newAchievements.includes('night_owl')) {
        newAchievements.push('night_owl')
        setNewAchievement('night_owl')
        setShowConfetti(true)
      }
      if (hour >= 5 && hour < 7 && !newAchievements.includes('early_bird')) {
        newAchievements.push('early_bird')
        setNewAchievement('early_bird')
        setShowConfetti(true)
      }
      if (newStreak >= 3 && !newAchievements.includes('streak_3')) {
        newAchievements.push('streak_3')
        setNewAchievement('streak_3')
        setShowConfetti(true)
      }
      if (existingProgress.visitCount >= 5 && !newAchievements.includes('regular')) {
        newAchievements.push('regular')
        setNewAchievement('regular')
        setShowConfetti(true)
      }
      
      const updatedProgress = {
        ...existingProgress,
        visitCount: isNewDay ? existingProgress.visitCount + 1 : existingProgress.visitCount,
        lastVisit: new Date().toISOString(),
        streak: newStreak,
        achievements: newAchievements,
      }
      
      localStorage.setItem('learnhub_progress', JSON.stringify(updatedProgress))
      setProgress(updatedProgress)
    } else {
      // First time visitor
      const newProgress: UserProgress = {
        name: '',
        visitCount: 1,
        lastVisit: new Date().toISOString(),
        achievements: ['first_visit'],
        streak: 1,
      }
      localStorage.setItem('learnhub_progress', JSON.stringify(newProgress))
      setProgress(newProgress)
      setNewAchievement('first_visit')
      setShowConfetti(true)
    }
  }, [])

  // Animate statistics
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCourses(Math.round(coursesCount * easeOut))
      setAnimatedInstructors(Math.round(instructorsCount * easeOut))
      setAnimatedCategories(Math.round(categoriesCount * easeOut))
      
      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [coursesCount, instructorsCount, categoriesCount])

  // Clear confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  // Clear achievement notification
  useEffect(() => {
    if (newAchievement) {
      const timer = setTimeout(() => setNewAchievement(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [newAchievement])

  const handleSaveName = () => {
    if (nameInput.trim() && progress) {
      const updatedProgress = { ...progress, name: nameInput.trim() }
      localStorage.setItem('learnhub_progress', JSON.stringify(updatedProgress))
      setProgress(updatedProgress)
      setShowNameInput(false)
      setNameInput('')
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getPersonalizedMessage = () => {
    if (!progress) return 'Start your learning journey today.'
    
    if (progress.name) {
      if (progress.visitCount === 1) {
        return `Welcome to LearnHub, ${progress.name}! Let's begin your learning adventure.`
      }
      if (progress.streak >= 3) {
        return `Amazing, ${progress.name}! You're on a ${progress.streak}-day streak! 🔥`
      }
      return `Welcome back, ${progress.name}! Ready to learn something new?`
    }
    
    if (progress.visitCount === 1) {
      return 'Welcome! Start your learning journey today.'
    }
    return `Welcome back! You've visited ${progress.visitCount} times.`
  }

  return (
    <section className="relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      {/* Achievement Toast */}
      {newAchievement && ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS] && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 shadow-xl border border-primary-400">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].icon}</span>
              <div>
                <p className="text-white font-bold">Achievement Unlocked!</p>
                <p className="text-primary-100 text-sm">{ACHIEVEMENTS[newAchievement as keyof typeof ACHIEVEMENTS].name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          {/* Streak Badge */}
          {progress && progress.streak > 1 && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6 animate-pulse-slow">
              <span className="text-xl">🔥</span>
              <span className="text-orange-400 font-semibold">{progress.streak}-day streak!</span>
            </div>
          )}
          
          {/* Personalized Greeting */}
          <div className="mb-4">
            <p className="text-primary-400 text-lg font-medium">
              {getGreeting()}! {progress?.name && <span className="text-white">{progress.name}</span>}
            </p>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Learn skills that
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
          </h1>
          
          <p className="text-xl text-navy-300 mb-4">
            {getPersonalizedMessage()}
          </p>
          
          {/* Set Name Button (for first-time visitors) */}
          {progress && !progress.name && (
            <div className="mb-8">
              {showNameInput ? (
                <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 px-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:border-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowNameInput(false)}
                    className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors"
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNameInput(true)}
                  className="text-primary-400 hover:text-primary-300 text-sm underline transition-colors"
                >
                  Personalize your experience →
                </button>
              )}
            </div>
          )}
          
          {!showNameInput && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          )}
          
          {/* Achievement Badges */}
          {progress && progress.achievements.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-navy-400 text-sm">Your badges:</span>
              <div className="flex gap-1">
                {progress.achievements.map((achievementId) => {
                  const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS]
                  if (!achievement) return null
                  return (
                    <div
                      key={achievementId}
                      className="group relative"
                      title={`${achievement.name}: ${achievement.description}`}
                    >
                      <span className="text-2xl cursor-pointer hover:scale-125 transition-transform inline-block">
                        {achievement.icon}
                      </span>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48">
                        <div className="bg-navy-800 rounded-lg p-2 text-center shadow-lg border border-navy-700">
                          <p className="text-white text-sm font-semibold">{achievement.name}</p>
                          <p className="text-navy-400 text-xs">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Animated Stats */}
        <div className="mt-8 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-bold text-white tabular-nums group-hover:text-primary-400 transition-colors">
              {animatedCourses}+
            </div>
            <div className="text-navy-400 text-sm">Courses</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-bold text-white tabular-nums group-hover:text-primary-400 transition-colors">
              {animatedInstructors}+
            </div>
            <div className="text-navy-400 text-sm">Instructors</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-bold text-white tabular-nums group-hover:text-primary-400 transition-colors">
              {animatedCategories}
            </div>
            <div className="text-navy-400 text-sm">Categories</div>
          </div>
        </div>
      </div>
    </section>
  )
}