'use client'

import { useState } from 'react'

const tips = [
  {
    icon: "🎯",
    title: "Set Clear Goals",
    description: "Define what you want to achieve before starting each course."
  },
  {
    icon: "⏰",
    title: "Schedule Study Time",
    description: "Consistency beats intensity. Even 30 minutes daily makes a difference."
  },
  {
    icon: "✍️",
    title: "Take Notes",
    description: "Writing helps retention. Summarize key concepts in your own words."
  },
  {
    icon: "🔄",
    title: "Practice Regularly",
    description: "Apply what you learn through projects and exercises."
  },
  {
    icon: "🤝",
    title: "Join Communities",
    description: "Connect with fellow learners to share knowledge and stay motivated."
  },
  {
    icon: "🌟",
    title: "Celebrate Progress",
    description: "Acknowledge your achievements, no matter how small."
  }
]

export default function LearningTips() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tips.map((tip, index) => (
        <button
          key={index}
          onClick={() => setExpandedTip(expandedTip === index ? null : index)}
          className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
            expandedTip === index
              ? 'bg-primary-500/10 border-primary-500/50 shadow-lg shadow-primary-500/10'
              : 'bg-navy-900/50 border-navy-800 hover:border-navy-700 hover:bg-navy-900'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{tip.icon}</span>
            <div>
              <h4 className="font-semibold text-white mb-1">{tip.title}</h4>
              <p className={`text-sm transition-all duration-300 ${
                expandedTip === index 
                  ? 'text-navy-200 opacity-100 max-h-20' 
                  : 'text-navy-400 opacity-70 max-h-0 overflow-hidden sm:max-h-20 sm:opacity-100'
              }`}>
                {tip.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}