'use client'

import { useState, useEffect } from 'react'

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  subtext?: string
  delay: number
}

function StatCard({ icon, label, value, subtext, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div 
      className={`bg-navy-800/50 rounded-xl p-4 border border-navy-700 transition-all duration-500 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-xs text-navy-400 uppercase tracking-wider">{label}</div>
          <div className="text-xl font-bold text-white">{value}</div>
          {subtext && <div className="text-xs text-primary-400">{subtext}</div>}
        </div>
      </div>
    </div>
  )
}

export default function QuickStats() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // These would typically come from user data/localStorage
  const stats = {
    lessonsCompleted: 12,
    hoursLearned: 8.5,
    coursesStarted: 3,
    certificatesEarned: 1,
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        icon="📖" 
        label="Lessons" 
        value={stats.lessonsCompleted}
        subtext="+3 this week"
        delay={0}
      />
      <StatCard 
        icon="⏱️" 
        label="Hours Learned" 
        value={stats.hoursLearned}
        subtext="+2.5 this week"
        delay={100}
      />
      <StatCard 
        icon="🎓" 
        label="Courses" 
        value={stats.coursesStarted}
        subtext="1 in progress"
        delay={200}
      />
      <StatCard 
        icon="🏆" 
        label="Certificates" 
        value={stats.certificatesEarned}
        subtext="Keep going!"
        delay={300}
      />
    </div>
  )
}