'use client'

import { useState } from 'react'
import type { Category } from '@/types'

interface SkillShowcaseProps {
  categories: Category[]
}

// Predefined skills with associated colors and icons
const skillData = [
  { name: 'JavaScript', color: 'from-yellow-400 to-yellow-600', icon: '⚡' },
  { name: 'TypeScript', color: 'from-blue-400 to-blue-600', icon: '📘' },
  { name: 'React', color: 'from-cyan-400 to-cyan-600', icon: '⚛️' },
  { name: 'Node.js', color: 'from-green-400 to-green-600', icon: '🟢' },
  { name: 'Python', color: 'from-blue-400 to-yellow-400', icon: '🐍' },
  { name: 'CSS', color: 'from-pink-400 to-purple-600', icon: '🎨' },
  { name: 'HTML', color: 'from-orange-400 to-red-500', icon: '📄' },
  { name: 'Vue.js', color: 'from-emerald-400 to-emerald-600', icon: '💚' },
  { name: 'AWS', color: 'from-orange-400 to-orange-600', icon: '☁️' },
  { name: 'Docker', color: 'from-blue-400 to-blue-600', icon: '🐳' },
  { name: 'Git', color: 'from-red-400 to-red-600', icon: '📊' },
  { name: 'SQL', color: 'from-indigo-400 to-indigo-600', icon: '🗃️' },
]

export default function SkillShowcase({ categories }: SkillShowcaseProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {skillData.map((skill, index) => (
        <div
          key={skill.name}
          className="skill-badge-wrapper"
          style={{ animationDelay: `${index * 50}ms` }}
          onMouseEnter={() => setHoveredSkill(skill.name)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div 
            className={`skill-badge bg-gradient-to-r ${skill.color} ${
              hoveredSkill === skill.name ? 'scale-110 shadow-lg' : ''
            }`}
          >
            <span className="skill-icon">{skill.icon}</span>
            <span className="skill-name">{skill.name}</span>
            {hoveredSkill === skill.name && (
              <div className="skill-sparkle">
                <span className="sparkle sparkle-1">✨</span>
                <span className="sparkle sparkle-2">✨</span>
                <span className="sparkle sparkle-3">✨</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Dynamic skills from categories */}
      {categories.slice(0, 4).map((category, index) => (
        <div
          key={category.id}
          className="skill-badge-wrapper"
          style={{ animationDelay: `${(skillData.length + index) * 50}ms` }}
          onMouseEnter={() => setHoveredSkill(category.id)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div 
            className={`skill-badge bg-gradient-to-r from-primary-400 to-primary-600 ${
              hoveredSkill === category.id ? 'scale-110 shadow-lg' : ''
            }`}
          >
            <span className="skill-icon">{category.metadata?.icon || '📂'}</span>
            <span className="skill-name">{category.metadata?.name || category.title}</span>
          </div>
        </div>
      ))}
    </div>
  )
}