'use client'

import { useState, useEffect } from 'react'

interface LearningFact {
  icon: string
  title: string
  fact: string
  source?: string
}

const learningFacts: LearningFact[] = [
  {
    icon: '🧠',
    title: 'Neuroplasticity',
    fact: 'Your brain can form new neural connections at any age. Learning literally changes the structure of your brain!',
    source: 'Harvard Medical School'
  },
  {
    icon: '⏰',
    title: 'Pomodoro Power',
    fact: '25 minutes of focused learning followed by a 5-minute break optimizes retention by up to 40%.',
    source: 'Cognitive Science Research'
  },
  {
    icon: '💤',
    title: 'Sleep Learning',
    fact: 'Your brain consolidates new information during sleep. Learning before bed can improve retention!',
    source: 'Nature Neuroscience'
  },
  {
    icon: '✍️',
    title: 'Active Recall',
    fact: 'Testing yourself on material is 50% more effective than re-reading for long-term memory.',
    source: 'Journal of Experimental Psychology'
  },
  {
    icon: '🎯',
    title: 'Spaced Repetition',
    fact: 'Reviewing material at increasing intervals can boost retention by up to 200%.',
    source: 'Learning Science Research'
  },
  {
    icon: '🤝',
    title: 'Teaching Effect',
    fact: 'When you teach something to others, you retain 90% of what you learned.',
    source: 'National Training Laboratories'
  },
  {
    icon: '🎮',
    title: 'Gamification',
    fact: 'Interactive learning increases engagement by 60% and improves problem-solving skills.',
    source: 'Educational Technology Research'
  },
  {
    icon: '🌍',
    title: 'Global Learning',
    fact: 'Online learners complete courses 5x faster than traditional classroom students on average.',
    source: 'IBM Training Study'
  },
]

export default function DidYouKnow() {
  const [currentFact, setCurrentFact] = useState<LearningFact | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Select a random fact
    const randomIndex = Math.floor(Math.random() * learningFacts.length)
    setCurrentFact(learningFacts[randomIndex])
  }, [])

  if (!currentFact) return null

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-navy-700 cursor-pointer transition-all duration-300 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-3xl animate-bounce-slow">
                {currentFact.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300">
                    💡 Did You Know?
                  </span>
                  <h3 className="text-lg font-semibold text-white">{currentFact.title}</h3>
                </div>
                
                <p className="text-navy-200 leading-relaxed">
                  {currentFact.fact}
                </p>
                
                {currentFact.source && (
                  <p className="mt-2 text-navy-500 text-sm">
                    Source: {currentFact.source}
                  </p>
                )}

                {/* Expanded view with all facts */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-navy-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {learningFacts.filter(f => f.title !== currentFact.title).slice(0, 4).map((fact, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-navy-800/50 border border-navy-700/50"
                      >
                        <div className="text-2xl mb-2">{fact.icon}</div>
                        <h4 className="text-sm font-medium text-white mb-1">{fact.title}</h4>
                        <p className="text-xs text-navy-400 line-clamp-3">{fact.fact}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Expand indicator */}
              <div className="flex-shrink-0">
                <svg 
                  className={`w-5 h-5 text-navy-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}