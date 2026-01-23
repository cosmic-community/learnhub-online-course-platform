import Link from 'next/link'
import type { Instructor } from '@/types'

interface InstructorCardProps {
  instructor: Instructor
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  const { metadata } = instructor

  return (
    <Link href={`/instructors/${instructor.slug}`} className="card group block p-6">
      <div className="flex items-center gap-4 mb-4">
        {metadata?.photo ? (
          <img
            src={`${metadata.photo.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
            alt={metadata?.name || instructor.title}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-navy-700 flex items-center justify-center">
            <span className="text-3xl">👨‍🏫</span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
            {metadata?.name || instructor.title}
          </h3>
          {metadata?.credentials && (
            <p className="text-sm text-primary-400">
              {metadata.credentials}
            </p>
          )}
        </div>
      </div>
      {metadata?.bio && (
        <p className="text-navy-400 text-sm line-clamp-3">
          {metadata.bio}
        </p>
      )}
    </Link>
  )
}