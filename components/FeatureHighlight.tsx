'use client'

import { useState } from 'react'

const features = [
  {
    icon: '🎓',
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with real-world experience at top companies.',
    color: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20'
  },
  {
    icon: '💻',
    title: 'Hands-On Projects',
    description: 'Build real projects that you can add to your portfolio and showcase to employers.',
    color: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500/30',
    iconBg: 'bg-purple-500/20'
  },
  {
    icon: '📱',
    title: 'Learn Anywhere',
    description: 'Access courses on any device. Your progress syncs across all platforms.',
    color: 'from-green-500/20 to-green-600/20',
    borderColor: 'border-green-500/30',
    iconBg: 'bg-green-500/20'
  },
  {
    icon: '🏆',
    title: 'Certificates',
    description: 'Earn certificates upon completion to showcase your new skills.',
    color: 'from-yellow-500/20 to-yellow-600/20',
    borderColor: 'border-yellow-500/30',
    iconBg: 'bg-yellow-500/20'
  }
]

export default function FeatureHighlight() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className={`relative overflow-hidden rounded-xl border ${feature.borderColor} bg-gradient-to-br ${feature.color} p-6 transition-all duration-300 cursor-pointer ${
            hoveredIndex === index ? 'scale-105 shadow-xl' : 'scale-100'
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Animated background orb */}
          <div 
            className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${feature.iconBg} blur-2xl transition-all duration-500 ${
              hoveredIndex === index ? 'opacity-100 scale-150' : 'opacity-50 scale-100'
            }`} 
          />
          
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center text-2xl mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-navy-300 text-sm leading-relaxed">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}