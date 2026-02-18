import Link from 'next/link'
import type { Lesson, Course } from '@/types'

interface QuickStartLessonProps {
  lesson: Lesson
  courses: Course[]
}

export default function QuickStartLesson({ lesson, courses }: QuickStartLessonProps) {
  // Find which course this lesson belongs to
  const parentCourse = courses.find(course => 
    course.metadata?.lessons?.some(l => l.id === lesson.id)
  )

  const durationMinutes = lesson.metadata?.duration_minutes || 20

  return (
    <div className="card p-6 relative overflow-hidden group hover:border-primary-500/50 transition-colors">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h3 className="text-lg font-semibold text-white">Quick Start</h3>
          </div>
          <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {durationMinutes} min
          </span>
        </div>
        
        <h4 className="text-white font-medium mb-2 line-clamp-1">
          {lesson.metadata?.title || lesson.title}
        </h4>
        
        {lesson.metadata?.description && (
          <p className="text-navy-400 text-sm mb-4 line-clamp-2">
            {lesson.metadata.description}
          </p>
        )}
        
        {parentCourse && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-navy-500">From:</span>
            <Link 
              href={`/courses/${parentCourse.slug}`}
              className="text-xs text-primary-400 hover:text-primary-300 truncate"
            >
              {parentCourse.title}
            </Link>
          </div>
        )}
        
        {parentCourse && (
          <Link 
            href={`/courses/${parentCourse.slug}/lessons/${lesson.slug}`}
            className="inline-flex items-center gap-2 text-sm bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors group/btn"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Start Learning</span>
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}