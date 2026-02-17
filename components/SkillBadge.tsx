'use client'

import { useState } from 'react'

interface SkillBadgeProps {
  skill: string
  color?: 'teal' | 'blue' | 'purple' | 'orange' | 'pink'
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

const skillIcons: Record<string, string> = {
  'react': '⚛️',
  'vue': '💚',
  'node': '🟢',
  'nodejs': '🟢',
  'javascript': '🟨',
  'typescript': '🔷',
  'python': '🐍',
  'aws': '☁️',
  'docker': '🐳',
  'kubernetes': '☸️',
  'mongodb': '🍃',
  'postgresql': '🐘',
  'graphql': '◈',
  'rest': '🔗',
  'api': '🔌',
  'css': '🎨',
  'html': '📄',
  'git': '📦',
  'testing': '🧪',
  'security': '🔒',
  'performance': '⚡',
  'design': '✨',
  'mobile': '📱',
  'web': '🌐',
  'database': '💾',
  'cloud': '☁️',
  'devops': '🔧',
  'backend': '⚙️',
  'frontend': '🖥️',
  'fullstack': '🚀',
}

const colorClasses = {
  teal: 'from-teal-500/20 to-teal-600/20 border-teal-500/30 text-teal-300',
  blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
  purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300',
  orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-300',
  pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-300',
}

const sizeClasses = {
  small: 'px-2 py-1 text-xs',
  medium: 'px-3 py-1.5 text-sm',
  large: 'px-4 py-2 text-base',
}

export default function SkillBadge({ 
  skill, 
  color = 'teal', 
  size = 'medium',
  animated = true 
}: SkillBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const skillLower = skill.toLowerCase()
  const icon = skillIcons[skillLower] || '💡'
  
  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        bg-gradient-to-r border backdrop-blur-sm
        transition-all duration-300 cursor-default
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${animated && isHovered ? 'scale-110 shadow-lg' : ''}
      `}
    >
      <span className={`transition-transform duration-300 ${animated && isHovered ? 'animate-bounce' : ''}`}>
        {icon}
      </span>
      <span>{skill}</span>
    </span>
  )
}