'use client'

import { useState, useEffect } from 'react'

interface Tip {
  emoji: string
  category: string
  title: string
  content: string
  actionText?: string
  actionHref?: string
}

const TIPS: Tip[] = [
  {
    emoji: '💡',
    category: 'Learning Strategy',
    title: 'The Feynman Technique',
    content: 'Try explaining what you learned to someone else (or a rubber duck). If you can\'t explain it simply, you don\'t understand it well enough.',
    actionText: 'Start a course',
    actionHref: '/courses'
  },
  {
    emoji: '⏰',
    category: 'Productivity',
    title: 'The Pomodoro Power',
    content: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break. Your brain will thank you!',
  },
  {
    emoji: '🧠',
    category: 'Memory',
    title: 'Spaced Repetition',
    content: 'Review what you learned today, tomorrow, in 3 days, then in a week. This pattern helps move knowledge to long-term memory.',
  },
  {
    emoji: '💻',
    category: 'Coding',
    title: 'Code Every Day',
    content: 'Even 15 minutes of coding daily builds stronger skills than 3 hours once a week. Consistency beats intensity!',
    actionText: 'Browse courses',
    actionHref: '/courses'
  },
  {
    emoji: '🎯',
    category: 'Goal Setting',
    title: 'Start Small, Dream Big',
    content: 'Pick ONE thing to learn well before moving on. Mastery in one area builds confidence for the next challenge.',
    actionText: 'Explore categories',
    actionHref: '/categories'
  },
  {
    emoji: '🔄',
    category: 'Practice',
    title: 'Active Recall',
    content: 'Don\'t just re-read notes. Close your laptop and write down everything you remember. The struggle to recall strengthens memory!',
  },
  {
    emoji: '🌙',
    category: 'Wellness',
    title: 'Sleep on It',
    content: 'Your brain consolidates learning during sleep. A good night\'s rest after studying is as important as the studying itself.',
  },
  {
    emoji: '🤝',
    category: 'Community',
    title: 'Learn Together',
    content: 'Teaching others is the best way to learn. Join study groups or help fellow learners - you\'ll understand concepts better!',
  },
  {
    emoji: '📝',
    category: 'Note-Taking',
    title: 'The Cornell Method',
    content: 'Divide your notes into cues, notes, and summary sections. Review by covering notes and using cues to recall information.',
  },
  {
    emoji: '🚀',
    category: 'Motivation',
    title: 'Celebrate Small Wins',
    content: 'Completed a lesson? Understood a concept? Celebrate it! Small wins fuel motivation for bigger achievements.',
  },
  {
    emoji: '🔍',
    category: 'Problem Solving',
    title: 'Debug Like a Pro',
    content: 'When stuck, explain the problem out loud. Often, articulating the issue helps you see the solution you missed.',
  },
  {
    emoji: '📚',
    category: 'Learning',
    title: 'Build Projects',
    content: 'Apply what you learn immediately by building small projects. Real-world practice cements theoretical knowledge.',
    actionText: 'Find project ideas',
    actionHref: '/courses'
  },
]

function getTodaysTip(): Tip {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  const tipIndex = dayOfYear % TIPS.length
  return TIPS[tipIndex] ?? TIPS[0]
}

export default function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTip(getTodaysTip())
  }, [])

  if (!mounted || !tip) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-24 bg-navy-800 rounded"></div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden group">
      {/* Header */}
      <div 
        className="p-4 bg-gradient-to-r from-primary-500/10 to-transparent border-b border-navy-800 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tip.emoji}</span>
          <div>
            <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
              Daily Tip • {tip.category}
            </span>
            <h3 className="text-white font-semibold">{tip.title}</h3>
          </div>
        </div>
        <button className="text-navy-400 hover:text-white transition-colors">
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-48' : 'max-h-0'}`}>
        <div className="p-4">
          <p className="text-navy-300 leading-relaxed">{tip.content}</p>
          
          {tip.actionHref && (
            <a 
              href={tip.actionHref}
              className="inline-flex items-center gap-2 mt-4 text-primary-400 hover:text-primary-300 font-medium text-sm transition-colors"
            >
              {tip.actionText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
      
      {/* Subtle animation line */}
      <div className="h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  )
}