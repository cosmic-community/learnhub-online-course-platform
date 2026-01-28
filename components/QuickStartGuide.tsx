'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Step {
  number: number
  title: string
  description: string
  icon: string
  link?: string
  linkText?: string
  completed: boolean
}

export default function QuickStartGuide() {
  const [steps] = useState<Step[]>([
    {
      number: 1,
      title: 'Browse Courses',
      description: 'Explore our catalog of expert-led courses',
      icon: '🔍',
      link: '/courses',
      linkText: 'View Courses',
      completed: true
    },
    {
      number: 2,
      title: 'Pick Your Path',
      description: 'Choose a category that matches your goals',
      icon: '🎯',
      link: '/categories',
      linkText: 'See Categories',
      completed: true
    },
    {
      number: 3,
      title: 'Start Learning',
      description: 'Jump into your first lesson today',
      icon: '🚀',
      completed: false
    },
    {
      number: 4,
      title: 'Track Progress',
      description: 'Watch your skills grow with achievements',
      icon: '📈',
      completed: false
    }
  ])

  const completedSteps = steps.filter(s => s.completed).length
  const progress = (completedSteps / steps.length) * 100

  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Quick Start Guide</h3>
            <p className="text-navy-400 text-sm">Complete these steps to get started</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary-400">{completedSteps}</span>
            <span className="text-navy-500">/{steps.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-navy-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                step.completed 
                  ? 'bg-primary-500/10 border border-primary-500/20' 
                  : 'bg-navy-800/50 border border-navy-700/50 hover:border-navy-600'
              }`}
            >
              {/* Step indicator */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                step.completed 
                  ? 'bg-primary-500/20' 
                  : 'bg-navy-700/50'
              }`}>
                {step.completed ? '✓' : step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${step.completed ? 'text-primary-400' : 'text-white'}`}>
                  {step.title}
                </h4>
                <p className="text-navy-400 text-sm truncate">{step.description}</p>
              </div>

              {/* Action */}
              {step.link && !step.completed && (
                <Link 
                  href={step.link}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium flex-shrink-0 transition-colors"
                >
                  {step.linkText} →
                </Link>
              )}
              {step.completed && (
                <span className="text-primary-500 text-sm flex-shrink-0">Done!</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}