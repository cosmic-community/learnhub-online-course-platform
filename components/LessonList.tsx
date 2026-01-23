import Link from 'next/link'
import type { Lesson } from '@/types'

interface LessonListProps {
  lessons: Lesson[]
  courseSlug: string
}

export default function LessonList({ lessons, courseSlug }: LessonListProps) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => (
        <Link
          key={lesson.id}
          href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
          className="flex items-center gap-4 p-4 rounded-lg bg-navy-800/50 hover:bg-navy-800 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-sm font-medium text-navy-200 group-hover:bg-primary-500 group-hover:text-white transition-colors flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
              {lesson.metadata?.title || lesson.title}
            </h4>
            {lesson.metadata?.description && (
              <p className="text-sm text-navy-400 truncate">
                {lesson.metadata.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-navy-400 flex-shrink-0">
            {lesson.metadata?.video_url && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            )}
            {lesson.metadata?.duration_minutes && (
              <span>{lesson.metadata.duration_minutes} min</span>
            )}
            <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  )
}