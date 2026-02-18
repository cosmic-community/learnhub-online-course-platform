import Link from 'next/link'
import type { Instructor } from '@/types'

interface InstructorCardProps {
  instructor: Instructor
  courseCount?: number
}

export default function InstructorCard({ instructor, courseCount }: InstructorCardProps) {
  const { metadata } = instructor
  const photo = metadata?.photo

  return (
    <Link href={`/instructors/${instructor.slug}`} className="card group block p-6">
      <div className="flex flex-col items-center text-center">
        {/* Photo */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-navy-700 group-hover:ring-primary-500/50 transition-all duration-300">
            {photo ? (
              <img
                src={`${photo.imgix_url}?w=192&h=192&fit=crop&auto=format,compress`}
                alt={metadata?.name || instructor.title}
                width={96}
                height={96}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                <span className="text-3xl">👨‍🏫</span>
              </div>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-navy-900" title="Active instructor" />
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
          {metadata?.name || instructor.title}
        </h3>

        {/* Credentials */}
        {metadata?.credentials && (
          <p className="text-sm text-primary-400 mt-1 line-clamp-1">
            {metadata.credentials}
          </p>
        )}

        {/* Bio */}
        {metadata?.bio && (
          <p className="text-navy-400 text-sm mt-3 line-clamp-3">
            {metadata.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-navy-800 w-full justify-center">
          {courseCount !== undefined && courseCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-navy-400">
              <span>📚</span>
              <span>{courseCount} course{courseCount !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-navy-400">
            <span>⭐</span>
            <span>4.9 rating</span>
          </div>
        </div>

        {/* View Profile Button */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-primary-400 text-sm font-medium flex items-center gap-1">
            View Profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}