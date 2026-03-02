// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import LessonList from '@/components/LessonList'
import type { Metadata } from 'next'
import CourseViewTracker from '@/components/CourseViewTracker'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({ slug: course.slug }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }

  return {
    title: `${course.metadata?.seo_title || course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline || '',
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = metadata?.lessons || []
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const difficulty = metadata?.difficulty?.value || 'Beginner'
  const price = metadata?.price || 0
  const isFree = metadata?.is_free || price === 0
  const estimatedHours = metadata?.estimated_hours || 0

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc: number, lesson: { metadata?: { duration_minutes?: number } }) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  return (
    <div className="py-12">
      {/* Track course view for "Continue Learning" feature */}
      <CourseViewTracker 
        slug={course.slug}
        title={metadata?.title || course.title}
        thumbnail={metadata?.thumbnail?.imgix_url}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-white">{metadata?.title || course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat: { id: string; slug: string; metadata?: { name?: string; icon?: string } }) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="badge bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                  >
                    {cat.metadata?.icon} {cat.metadata?.name || 'Category'}
                  </Link>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className={`badge ${
                  difficulty === 'Beginner' ? 'badge-beginner' :
                  difficulty === 'Intermediate' ? 'badge-intermediate' :
                  'badge-advanced'
                }`}>
                  {difficulty}
                </span>
                {isFree && <span className="badge badge-free">Free</span>}
                <span className="text-navy-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {estimatedHours > 0 ? `${estimatedHours} hours` : `${totalMinutes} min`}
                </span>
                <span className="text-navy-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {lessons.length} lessons
                </span>
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="mb-8">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={metadata?.title || course.title}
                  className="w-full rounded-2xl"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                <div className="prose">
                  {metadata.description.split('\n').map((paragraph: string, idx: number) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={idx}>{paragraph.replace('# ', '')}</h1>
                    }
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={idx}>{paragraph.replace('## ', '')}</h2>
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={idx}>{paragraph.replace('- ', '')}</li>
                    }
                    if (paragraph.trim()) {
                      return <p key={idx}>{paragraph}</p>
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {/* Lessons */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                <LessonList lessons={lessons} courseSlug={course.slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Price Card */}
              <div className="card p-6">
                <div className="text-center mb-6">
                  {isFree ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">${price}</div>
                  )}
                </div>
                <button className="w-full btn-primary mb-3">
                  {isFree ? 'Start Learning' : 'Enroll Now'}
                </button>
                <p className="text-center text-navy-500 text-sm">
                  Full lifetime access
                </p>
              </div>

              {/* Course includes */}
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">This course includes:</h3>
                <ul className="space-y-3 text-navy-300 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {lessons.length} video lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {estimatedHours > 0 ? `${estimatedHours} hours` : `${totalMinutes} minutes`} of content
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Access on all devices
                  </li>
                </ul>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor: { id: string; slug: string; metadata?: { name?: string; photo?: { imgix_url?: string }; credentials?: string } }) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || 'Instructor'}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-lg">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || 'Instructor'}
                          </p>
                          {instructor.metadata?.credentials && (
                            <p className="text-navy-400 text-sm truncate max-w-[180px]">
                              {instructor.metadata.credentials}
                            </p>
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
    </div>
  )
}