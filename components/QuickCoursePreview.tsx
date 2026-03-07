'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface QuickCoursePreviewProps {
  course: Course
}

export default function QuickCoursePreview({ course }: QuickCoursePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { metadata } = course
  
  const lessonCount = metadata?.lessons?.length ?? 0
  const instructorName = metadata?.instructors?.[0]?.metadata?.name ?? 'Expert Instructor'
  const difficulty = typeof metadata?.difficulty === 'object' 
    ? metadata.difficulty.value 
    : metadata?.difficulty ?? 'Beginner'
  
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/courses/${course.slug}`}>
        <div className="card overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20">
          {/* Thumbnail with overlay */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={metadata?.thumbnail?.imgix_url 
                ? `${metadata.thumbnail.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`
                : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format,compress'
              }
              alt={metadata?.title ?? course.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent opacity-60" />
            
            {/* Quick preview panel - slides up on hover */}
            <div 
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900 to-navy-900/95 p-4 transform transition-all duration-300 ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-navy-300 mb-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessonCount} lessons
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {metadata?.estimated_hours ?? 5}h
                </span>
              </div>
              <div className="text-xs text-navy-400">
                By {instructorName}
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`badge ${
                difficulty === 'Beginner' ? 'badge-beginner' : 
                difficulty === 'Intermediate' ? 'badge-intermediate' : 
                'badge-advanced'
              }`}>
                {difficulty}
              </span>
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
            </div>
            
            {/* Play button overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-16 h-16 bg-primary-500/90 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/50 transform transition-transform duration-300 hover:scale-110">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
              {metadata?.title ?? course.title}
            </h3>
            <p className="text-navy-400 text-sm line-clamp-2 mb-4">
              {metadata?.tagline ?? 'Master new skills with expert-led instruction'}
            </p>
            
            {/* Price and CTA */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                {metadata?.is_free ? (
                  <span className="text-primary-400">Free</span>
                ) : (
                  <span className="text-white">${metadata?.price ?? 79}</span>
                )}
              </div>
              <span className="text-primary-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Start Learning
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}