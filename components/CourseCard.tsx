'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'

interface CourseCardProps {
  course: Course
}

function getDifficultyValue(difficulty: unknown): string {
  if (!difficulty) return 'beginner'
  if (typeof difficulty === 'string') return difficulty.toLowerCase()
  if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
    return String((difficulty as { value: unknown }).value).toLowerCase()
  }
  return 'beginner'
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { metadata } = course
  
  const difficulty = getDifficultyValue(metadata?.difficulty)
  const isFree = metadata?.is_free
  const price = metadata?.price

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!showConfetti) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  return (
    <Link 
      href={`/courses/${course.slug}`} 
      className="card group block relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {metadata?.thumbnail?.imgix_url ? (
          <img
            src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
            alt={metadata?.title || course.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`badge badge-${difficulty}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          {isFree && (
            <span className="badge badge-free">Free</span>
          )}
        </div>

        {/* Hover glow */}
        <div className={`absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {metadata.tagline}
          </p>
        )}

        {/* Instructor */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {metadata.instructors[0]?.metadata?.photo?.imgix_url ? (
              <img
                src={`${metadata.instructors[0].metadata.photo.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                alt={metadata.instructors[0].metadata?.name || 'Instructor'}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs">
                👨‍🏫
              </div>
            )}
            <span className="text-sm text-navy-300">
              {metadata.instructors[0]?.metadata?.name || metadata.instructors[0]?.title}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <div className="flex items-center gap-4 text-sm text-navy-400">
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <span>⏱</span>
                {metadata.estimated_hours}h
              </span>
            )}
            {metadata?.lessons && metadata.lessons.length > 0 && (
              <span className="flex items-center gap-1">
                <span>📖</span>
                {metadata.lessons.length} lessons
              </span>
            )}
          </div>
          
          <div className="font-bold">
            {isFree ? (
              <span className="text-primary-400">Free</span>
            ) : price ? (
              <span className="text-white">${price}</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}