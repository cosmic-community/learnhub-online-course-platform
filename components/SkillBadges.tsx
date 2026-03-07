'use client'

import { useState } from 'react'

interface Skill {
  name: string
  icon: string
  color: string
  level: 'beginner' | 'intermediate' | 'advanced'
}

const skills: Skill[] = [
  { name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-500', level: 'intermediate' },
  { name: 'TypeScript', icon: '📘', color: 'from-blue-500 to-indigo-500', level: 'intermediate' },
  { name: 'Node.js', icon: '💚', color: 'from-green-500 to-emerald-500', level: 'beginner' },
  { name: 'CSS', icon: '🎨', color: 'from-purple-500 to-pink-500', level: 'advanced' },
  { name: 'AWS', icon: '☁️', color: 'from-orange-500 to-amber-500', level: 'beginner' },
  { name: 'Vue.js', icon: '💚', color: 'from-emerald-500 to-teal-500', level: 'beginner' },
]

export default function SkillBadges() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'beginner': return 'w-1/3'
      case 'intermediate': return 'w-2/3'
      case 'advanced': return 'w-full'
      default: return 'w-1/3'
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🏆</span>
        <div>
          <h3 className="text-lg font-semibold text-white">Popular Skills</h3>
          <p className="text-sm text-navy-400">Trending technologies to learn</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform ${
              hoveredSkill === skill.name
                ? 'scale-105 bg-navy-800 shadow-lg'
                : 'bg-navy-900/50 hover:bg-navy-800/50'
            }`}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            {/* Glow effect on hover */}
            {hoveredSkill === skill.name && (
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${skill.color} opacity-10 blur-xl`} />
            )}
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{skill.icon}</span>
                <span className="font-medium text-white">{skill.name}</span>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-500 ${
                    hoveredSkill === skill.name ? getLevelWidth(skill.level) : 'w-0'
                  }`}
                />
              </div>
              
              <span className={`text-xs mt-1 inline-block capitalize ${
                hoveredSkill === skill.name ? 'text-primary-400' : 'text-navy-500'
              }`}>
                {skill.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-navy-800">
        <p className="text-xs text-navy-400 text-center">
          ✨ Hover over skills to see course coverage
        </p>
      </div>
    </div>
  )
}