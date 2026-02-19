'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import DifficultyBadge from './DifficultyBadge'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { metadata } = course
  const thumbnail = metadata?.thumbnail
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const lessons = metadata?.lessons || []

  return (
    <Link 
      href={`/courses/${course.slug}`} 
      className="card group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <img
            src={`${thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={course.title}
            width={400}
            height={225}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
            <span className={`text-5xl transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : ''}`}>📚</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="btn-primary text-sm py-2 px-4">
              Start Learning →
            </span>
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          {metadata?.is_free ? (
            <span className="badge badge-free animate-pulse-slow">Free</span>
          ) : (
            <span className="badge bg-navy-900/90 text-white backdrop-blur-sm">
              ${metadata?.price || 0}
            </span>
          )}
        </div>

        {/* Progress indicator (visual only, for future use) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-navy-800">
          <div 
            className="h-full bg-primary-400 transition-all duration-500"
            style={{ width: isHovered ? '15%' : '0%' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-xs text-navy-400 flex items-center gap-1"
              >
                <span className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                  {category.metadata?.icon}
                </span>
                {category.metadata?.name || category.title}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {course.title}
        </h3>

        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-navy-400">
          {metadata?.difficulty && (
            <DifficultyBadge difficulty={metadata.difficulty} size="small" />
          )}
          
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {lessons.length} lessons
          </span>
          
          {metadata?.estimated_hours && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {metadata.estimated_hours}h
            </span>
          )}
        </div>

        {/* Instructor */}
        {instructors.length > 0 && instructors[0] && (
          <div className="mt-4 pt-4 border-t border-navy-800 flex items-center gap-3">
            {instructors[0].metadata?.photo ? (
              <img
                src={`${instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={instructors[0].metadata?.name || instructors[0].title}
                width={32}
                height={32}
                className={`w-8 h-8 rounded-full object-cover ring-2 ring-transparent transition-all ${isHovered ? 'ring-primary-400' : ''}`}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm">
                👨‍🏫
              </div>
            )}
            <span className="text-sm text-navy-300">
              {instructors[0].metadata?.name || instructors[0].title}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}