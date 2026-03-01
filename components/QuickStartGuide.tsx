'use client'

import { useState } from 'react'
import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Browse Courses',
    description: 'Explore our catalog of expert-led courses across various categories.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: 'from-blue-400 to-blue-600',
    link: '/courses'
  },
  {
    number: '02',
    title: 'Choose Your Path',
    description: 'Select a category that matches your learning goals and interests.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    color: 'from-purple-400 to-purple-600',
    link: '/categories'
  },
  {
    number: '03',
    title: 'Start Learning',
    description: 'Dive into video lessons, code examples, and hands-on projects.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-400 to-green-600',
    link: '/courses'
  },
  {
    number: '04',
    title: 'Build & Grow',
    description: 'Apply your skills on real projects and advance your career.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-orange-400 to-orange-600',
    link: '/contact'
  }
]

export default function QuickStartGuide() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section className="py-16 bg-navy-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            How It Works
          </h2>
          <p className="text-navy-400 text-lg max-w-2xl mx-auto">
            Start your learning journey in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Link
              key={step.number}
              href={step.link}
              className="group relative"
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-navy-800">
                  <div 
                    className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500 ${
                      activeStep !== null && activeStep >= index ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}

              <div className="relative bg-navy-900/50 backdrop-blur-sm border border-navy-800 rounded-2xl p-6 hover:border-navy-700 transition-all duration-300 hover:transform hover:-translate-y-1 h-full">
                {/* Step number */}
                <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} bg-opacity-10 flex items-center justify-center mb-4 text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${step.color}`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-navy-400 text-sm">
                  {step.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Get Started</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}