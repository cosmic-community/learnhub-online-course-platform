'use client'

import { useState } from 'react'
import Link from 'next/link'

const steps = [
  {
    number: 1,
    title: "Browse Courses",
    description: "Explore our catalog of expert-led courses across various topics",
    icon: "🔍",
    link: "/courses",
    linkText: "View Courses"
  },
  {
    number: 2,
    title: "Pick Your Path",
    description: "Choose a category that matches your learning goals",
    icon: "🎯",
    link: "/categories",
    linkText: "See Categories"
  },
  {
    number: 3,
    title: "Start Learning",
    description: "Dive into lessons with video, code examples, and hands-on exercises",
    icon: "🚀",
    link: "/courses",
    linkText: "Begin Now"
  },
]

export default function QuickStartGuide() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  
  return (
    <div className="py-16 bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
            ✨ Getting Started
          </span>
          <h2 className="text-3xl font-bold text-white mb-2">Start Learning in 3 Simple Steps</h2>
          <p className="text-navy-400">Your journey to mastery begins here</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeStep === step.number
                  ? 'bg-primary-500/10 border-primary-500/40 scale-105'
                  : 'bg-navy-900/50 border-navy-800 hover:border-navy-700'
              }`}
              onMouseEnter={() => setActiveStep(step.number)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step number badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary-500/30">
                {step.number}
              </div>
              
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-navy-400 text-sm mb-4">{step.description}</p>
              
              <Link 
                href={step.link}
                className="inline-flex items-center text-primary-400 hover:text-primary-300 text-sm font-medium group"
              >
                {step.linkText}
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              {/* Connecting line for desktop */}
              {step.number < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-navy-700" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}