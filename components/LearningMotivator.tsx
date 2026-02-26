'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LearningMotivatorProps {
  totalCourses: number
  totalLessons: number
  totalHours: number
}

const motivationalMessages = [
  { emoji: '🌟', message: "Every expert was once a beginner. Start your journey today!" },
  { emoji: '💪', message: "Small steps lead to big achievements. Keep learning!" },
  { emoji: '🎯', message: "Focus on progress, not perfection. You've got this!" },
  { emoji: '🚀', message: "Your future self will thank you for learning today." },
  { emoji: '🧠', message: "The more you learn, the more you earn. Invest in yourself!" },
  { emoji: '⚡', message: "Consistency beats intensity. One lesson at a time!" },
  { emoji: '🌱', message: "Growth happens outside your comfort zone. Embrace the challenge!" },
  { emoji: '🏆', message: "Champions are made in practice. Start practicing!" },
  { emoji: '✨', message: "Your potential is unlimited. Unlock it with knowledge!" },
  { emoji: '🔥', message: "Stay curious, stay hungry. The best is yet to come!" },
]

const learningFacts = [
  "Did you know? Developers who learn consistently are 40% more likely to get promoted.",
  "Fun fact: It takes about 20 hours of focused practice to learn any new skill!",
  "Pro tip: Teaching others what you learn increases retention by 90%.",
  "Research shows: Learning new skills keeps your brain young and agile!",
  "Insight: The tech industry values continuous learners over static experts.",
]

export default function LearningMotivator({ totalCourses, totalLessons, totalHours }: LearningMotivatorProps) {
  const [currentMessage, setCurrentMessage] = useState(motivationalMessages[0])
  const [currentFact, setCurrentFact] = useState(learningFacts[0])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Pick random message and fact based on current time
    const now = new Date()
    const messageIndex = (now.getHours() + now.getMinutes()) % motivationalMessages.length
    const factIndex = now.getDate() % learningFacts.length
    
    setCurrentMessage(motivationalMessages[messageIndex] ?? motivationalMessages[0])
    setCurrentFact(learningFacts[factIndex] ?? learningFacts[0])
    
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' }
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️' }
    if (hour < 21) return { text: 'Good evening', emoji: '🌆' }
    return { text: 'Night owl mode', emoji: '🦉' }
  }

  const greeting = getGreeting()

  return (
    <section className={`py-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-navy-900/50 border border-primary-500/20 p-8">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slower" />
          
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Greeting & Motivation */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-navy-800/50 rounded-full px-4 py-2 mb-4">
                <span className="text-2xl">{greeting.emoji}</span>
                <span className="text-navy-200 font-medium">{greeting.text}, learner!</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="text-4xl animate-bounce-slow">{currentMessage.emoji}</span>
                <p className="text-xl text-white font-semibold max-w-md">
                  {currentMessage.message}
                </p>
              </div>
              
              <p className="text-navy-300 text-sm italic mb-6">
                💡 {currentFact}
              </p>
              
              <Link 
                href="/courses" 
                className="inline-flex items-center gap-2 btn-primary group"
              >
                Start Learning Now
                <svg 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-navy-800/60 backdrop-blur rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/50 transition-colors group">
                <span className="text-3xl block mb-1 group-hover:scale-110 transition-transform">📚</span>
                <span className="text-2xl font-bold text-white">{totalCourses}</span>
                <span className="text-navy-400 text-xs block">Courses</span>
              </div>
              <div className="bg-navy-800/60 backdrop-blur rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/50 transition-colors group">
                <span className="text-3xl block mb-1 group-hover:scale-110 transition-transform">🎯</span>
                <span className="text-2xl font-bold text-white">{totalLessons}</span>
                <span className="text-navy-400 text-xs block">Lessons</span>
              </div>
              <div className="bg-navy-800/60 backdrop-blur rounded-xl p-4 text-center border border-navy-700/50 hover:border-primary-500/50 transition-colors group">
                <span className="text-3xl block mb-1 group-hover:scale-110 transition-transform">⏱️</span>
                <span className="text-2xl font-bold text-white">{totalHours}h</span>
                <span className="text-navy-400 text-xs block">Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}