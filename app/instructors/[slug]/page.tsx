// app/instructors/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getInstructorBySlug, getCoursesByInstructor, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const instructors = await getInstructors()
  return instructors.map((instructor) => ({
    slug: instructor.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const instructor = await getInstructorBySlug(slug)
  
  if (!instructor) {
    return { title: 'Instructor Not Found - LearnHub' }
  }
  
  return {
    title: `${instructor.metadata?.name || instructor.title} - Instructor - LearnHub`,
    description: instructor.metadata?.bio || `Learn from ${instructor.metadata?.name || instructor.title}`,
  }
}

export default async function InstructorPage({ params }: PageProps) {
  const { slug } = await params
  const instructor = await getInstructorBySlug(slug)
  
  if (!instructor) {
    notFound()
  }

  const courses = await getCoursesByInstructor(instructor.id)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-primary-400">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-navy-200">{instructor.metadata?.name || instructor.title}</li>
          </ol>
        </nav>

        {/* Instructor Profile */}
        <div className="card p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              {instructor.metadata?.photo ? (
                <img
                  src={`${instructor.metadata.photo.imgix_url}?w=320&h=320&fit=crop&auto=format,compress`}
                  alt={instructor.metadata?.name || instructor.title}
                  width={160}
                  height={160}
                  className="w-40 h-40 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-40 h-40 rounded-2xl bg-navy-700 flex items-center justify-center">
                  <span className="text-6xl">👨‍🏫</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {instructor.metadata?.name || instructor.title}
              </h1>
              
              {instructor.metadata?.credentials && (
                <p className="text-primary-400 font-medium mb-4">
                  {instructor.metadata.credentials}
                </p>
              )}
              
              {instructor.metadata?.bio && (
                <p className="text-navy-300 leading-relaxed">
                  {instructor.metadata.bio}
                </p>
              )}

              <div className="mt-6 flex items-center gap-6 text-navy-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor's Courses */}
        {courses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">
              Courses by {instructor.metadata?.name || instructor.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}