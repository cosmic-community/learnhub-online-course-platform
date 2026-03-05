// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import CourseViewTracker from '@/components/CourseViewTracker'

// Helper function to safely get metafield values
function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'number' || typeof field === 'boolean') return String(field)
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value)
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key)
  }
  return ''
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const difficulty = getMetafieldValue(metadata?.difficulty) || 'Beginner'
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Track this course view for Quick Start feature */}
      <CourseViewTracker courseSlug={course.slug} courseTitle={metadata?.title || course.title} />
      
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/" className="text-navy-400 hover:text-primary-400 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-navy-600">/</li>
          <li>
            <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
              Courses
            </Link>
          </li>
          <li className="text-navy-600">/</li>
          <li className="text-navy-200">{metadata?.title || course.title}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category: { id: string; slug: string; metadata?: { name?: string; icon?: string } }) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="badge bg-navy-800 text-navy-200 hover:bg-navy-700 transition-colors"
                >
                  {category.metadata?.icon} {category.metadata?.name}
                </Link>
              ))}
              <span className={`badge badge-${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
              {metadata?.is_free && (
                <span className="badge badge-free">Free</span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              {metadata?.title || course.title}
            </h1>
            
            {metadata?.tagline && (
              <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
            )}

            {/* Course Stats */}
            <div className="flex flex-wrap gap-6 text-navy-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{hours > 0 ? `${hours}h ` : ''}{minutes}m total</span>
              </div>
              {metadata?.estimated_hours && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{metadata.estimated_hours} hours to complete</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Thumbnail */}
          {metadata?.thumbnail?.imgix_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={`${metadata.thumbnail.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                alt={metadata?.title || course.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Course Description */}
          {metadata?.description && (
            <div className="prose mb-12">
              <h2>About This Course</h2>
              <div dangerouslySetInnerHTML={{ __html: metadata.description.replace(/\n/g, '<br />') }} />
            </div>
          )}

          {/* Lessons List */}
          {lessons.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
              <div className="space-y-3">
                {lessons
                  .sort((a: { metadata?: { order?: number } }, b: { metadata?: { order?: number } }) => 
                    (a.metadata?.order ?? 999) - (b.metadata?.order ?? 999)
                  )
                  .map((lesson: { 
                    id: string
                    slug: string
                    metadata?: { 
                      title?: string
                      description?: string
                      duration_minutes?: number
                      order?: number 
                    } 
                  }, index: number) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                    className="card flex items-center gap-4 p-4 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center text-navy-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {lesson.metadata?.title || 'Untitled Lesson'}
                      </h3>
                      {lesson.metadata?.description && (
                        <p className="text-sm text-navy-400 truncate">
                          {lesson.metadata.description}
                        </p>
                      )}
                    </div>
                    {lesson.metadata?.duration_minutes && (
                      <div className="flex-shrink-0 text-sm text-navy-500">
                        {lesson.metadata.duration_minutes} min
                      </div>
                    )}
                    <svg 
                      className="w-5 h-5 text-navy-600 group-hover:text-primary-400 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Price Card */}
            <div className="card p-6">
              <div className="text-center mb-6">
                {metadata?.is_free ? (
                  <div className="text-3xl font-bold text-green-400">Free</div>
                ) : (
                  <div className="text-3xl font-bold text-white">
                    ${metadata?.price || 0}
                  </div>
                )}
              </div>
              
              {lessons.length > 0 && (
                <Link
                  href={`/courses/${course.slug}/lessons/${lessons[0].slug}`}
                  className="btn-primary w-full mb-4"
                >
                  Start Learning
                </Link>
              )}
              
              <div className="text-sm text-navy-400 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Access on mobile and desktop</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>

            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Instructors</h3>
                <div className="space-y-4">
                  {instructors.map((instructor: {
                    id: string
                    slug: string
                    metadata?: {
                      name?: string
                      photo?: { imgix_url?: string }
                      credentials?: string
                    }
                  }) => (
                    <Link
                      key={instructor.id}
                      href={`/instructors/${instructor.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || 'Instructor'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center text-xl">
                          👨‍🏫
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {instructor.metadata?.name || 'Instructor'}
                        </div>
                        {instructor.metadata?.credentials && (
                          <div className="text-sm text-navy-400 line-clamp-1">
                            {instructor.metadata.credentials}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}