'use client'

import Link from 'next/link'
import type { Category } from '@/types'

interface QuickStartPathsProps {
  categories: Category[]
}

const pathColors = [
  'from-teal-500 to-emerald-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-green-500 to-lime-500',
]

export default function QuickStartPaths({ categories }: QuickStartPathsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.slice(0, 4).map((category, index) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group relative overflow-hidden rounded-2xl p-6 bg-navy-900/50 border border-navy-800 hover:border-navy-700 transition-all duration-300"
        >
          {/* Animated gradient background on hover */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${pathColors[index % pathColors.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          />
          
          {/* Floating icon */}
          <div className="relative mb-4">
            <span className="text-4xl block transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
              {category.metadata?.icon || '📚'}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
            {category.metadata?.name || category.title}
          </h3>
          
          {category.metadata?.description && (
            <p className="text-navy-400 text-sm line-clamp-2">
              {category.metadata.description}
            </p>
          )}
          
          {/* Arrow indicator */}
          <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}