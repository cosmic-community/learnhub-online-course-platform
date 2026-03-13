'use client'

import Link from 'next/link'
import type { Course } from '@/types'
import { useState } from 'react'

interface CourseCardProps {
  course: Course
}

function getDifficultyValue(difficulty: Course['metadata']['difficulty']): string {
  if (!difficulty) return 'Beginner'
  if (typeof difficulty === 'string') return difficulty
  return difficulty.value || 'Beginner'
}

export default function CourseCard({ course }: CourseCardProps) {
  const { metadata } = course
  const [isHovered, setIsHovered] = useState(false)
  
  const difficultyValue = getDifficultyValue(metadata?.difficulty)
  const difficultyBadge = difficultyValue.toLowerCase()
  
  const thumbnailUrl = metadata?.thumbnail?.imgix_url
    ? `${metadata.thumbnail.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`
    : null

  const instructorPhoto = metadata?.instructors?.[0]?.metadata?.photo?.imgix_url
    ? `${metadata.instructors[0].metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`
    : null

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="card group flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={metadata?.title || course.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-navy-800 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          {metadata?.is_free ? (
            <span className="badge badge-free">Free</span>
          ) : (
            <span className="badge bg-navy-900/90 text-white backdrop-blur-sm">
              ${metadata?.price || 0}
            </span>
          )}
        </div>

        {/* Play icon on hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-16 h-16 rounded-full bg-primary-500/90 backdrop-blur flex items-center justify-center transform transition-transform group-hover:scale-110">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Categories */}
        {metadata?.categories && metadata.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {metadata.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-xs text-primary-400 font-medium"
              >
                {cat.metadata?.icon} {cat.metadata?.name || cat.title}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {metadata?.title || course.title}
        </h3>
        
        {metadata?.tagline && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2 flex-1">
            {metadata.tagline}
          </p>
        )}

        {/* Instructor */}
        {metadata?.instructors && metadata.instructors.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            {instructorPhoto ? (
              <img
                src={instructorPhoto}
                alt={metadata.instructors[0].metadata?.name || ''}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-navy-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-sm">
                👨‍🏫
              </div>
            )}
            <span className="text-sm text-navy-300">
              {metadata.instructors[0].metadata?.name || metadata.instructors[0].title}
            </span>
          </div>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <span className={`badge badge-${difficultyBadge}`}>
            {difficultyValue}
          </span>
          <div className="flex items-center gap-4 text-sm text-navy-400">
            {metadata?.lessons && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {metadata.lessons.length} lessons
              </span>
            )}
            {metadata?.estimated_hours && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {metadata.estimated_hours}h
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}