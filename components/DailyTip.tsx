'use client'

import { useState, useEffect } from 'react'

interface LearningTip {
  emoji: string
  title: string
  content: string
  category: string
}

const LEARNING_TIPS: LearningTip[] = [
  {
    emoji: '🧠',
    title: 'Spaced Repetition',
    content: 'Review material at increasing intervals. Learning the same thing multiple times over days helps it stick in your long-term memory.',
    category: 'Memory'
  },
  {
    emoji: '✍️',
    title: 'Active Recall',
    content: 'Instead of re-reading notes, close them and try to recall the information. This strengthens neural pathways and improves retention.',
    category: 'Learning'
  },
  {
    emoji: '🎯',
    title: 'Pomodoro Technique',
    content: 'Work in 25-minute focused sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-30 minute break.',
    category: 'Productivity'
  },
  {
    emoji: '💻',
    title: 'Learn by Doing',
    content: 'Build projects while learning! The best way to understand code is to write it. Start small and gradually increase complexity.',
    category: 'Coding'
  },
  {
    emoji: '📝',
    title: 'Teach What You Learn',
    content: 'Explaining concepts to others (or even a rubber duck!) helps identify gaps in your understanding and reinforces learning.',
    category: 'Learning'
  },
  {
    emoji: '🌙',
    title: 'Sleep on It',
    content: 'Your brain consolidates memories during sleep. Learning before bed and reviewing in the morning can boost retention by up to 20%.',
    category: 'Memory'
  },
  {
    emoji: '🔗',
    title: 'Connect the Dots',
    content: 'Link new concepts to things you already know. Creating mental associations makes information easier to recall.',
    category: 'Learning'
  },
  {
    emoji: '🏃',
    title: 'Move Your Body',
    content: 'Even a 10-minute walk can boost creativity and focus. Physical activity increases blood flow to the brain and improves cognitive function.',
    category: 'Wellness'
  },
  {
    emoji: '📖',
    title: 'Read Documentation',
    content: 'Official docs are your best friend. They often contain insights and best practices that tutorials miss.',
    category: 'Coding'
  },
  {
    emoji: '🤝',
    title: 'Join a Community',
    content: 'Learning with others accelerates growth. Join Discord servers, forums, or local meetups related to what you\'re studying.',
    category: 'Community'
  },
  {
    emoji: '🎮',
    title: 'Gamify Learning',
    content: 'Set personal challenges, track progress, and reward yourself for milestones. Making learning fun increases motivation and engagement.',
    category: 'Motivation'
  },
  {
    emoji: '❓',
    title: 'Ask Better Questions',
    content: 'When stuck, formulate specific questions. "How do I center a div with flexbox?" is better than "How do I use CSS?"',
    category: 'Problem Solving'
  },
  {
    emoji: '🔄',
    title: 'Embrace Mistakes',
    content: 'Errors are learning opportunities, not failures. Debug with curiosity, not frustration. Every bug fixed is a lesson learned.',
    category: 'Mindset'
  },
  {
    emoji: '📅',
    title: 'Consistency Over Intensity',
    content: '30 minutes daily beats 5 hours once a week. Regular practice builds stronger neural connections than sporadic cramming.',
    category: 'Habits'
  },
]

export default function DailyTip() {
  const [tip, setTip] = useState<LearningTip | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Get a consistent tip for the day based on the date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const tipIndex = dayOfYear % LEARNING_TIPS.length
    setTip(LEARNING_TIPS[tipIndex])
  }, [])

  if (!tip) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-navy-700 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-navy-700 rounded"></div>
      </div>
    )
  }

  return (
    <div 
      className="card p-6 cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tip.emoji}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">Daily Tip</h3>
              <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
                {tip.category}
              </span>
            </div>
          </div>
          <div className="text-navy-500 text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Click to flip
          </div>
        </div>
        
        <div className={`transition-all duration-500 ${isFlipped ? 'opacity-0 h-0' : 'opacity-100'}`}>
          <h4 className="text-primary-400 font-medium mb-2">{tip.title}</h4>
          <p className="text-navy-300 text-sm leading-relaxed">{tip.content}</p>
        </div>
        
        <div className={`transition-all duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="text-center py-4">
            <div className="text-4xl mb-3">💡</div>
            <p className="text-navy-300 text-sm">
              Try applying this tip today! Small improvements compound over time.
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <button 
                className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full hover:bg-primary-500/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  // Could integrate with a bookmarking system
                }}
              >
                ⭐ Save Tip
              </button>
              <button 
                className="text-xs bg-navy-700 text-navy-300 px-3 py-1 rounded-full hover:bg-navy-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(false)
                }}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* New tip indicator */}
      <div className="absolute top-2 right-2">
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
        </span>
      </div>
    </div>
  )
}