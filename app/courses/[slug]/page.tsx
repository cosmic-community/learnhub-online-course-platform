// app/courses/[slug]/page.tsx
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import CourseViewTracker from '@/components/CourseViewTracker'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return {
      title: 'Course Not Found - LearnHub',
    }
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

  // Get difficulty badge class
  const getDifficultyClass = () => {
    const difficulty = metadata?.difficulty?.value?.toLowerCase() || metadata?.difficulty?.key?.toLowerCase() || 'beginner'
    switch (difficulty) {
      case 'beginner':
        return 'badge-beginner'
      case 'intermediate':
        return 'badge-intermediate'
      case 'advanced':
        return 'badge-advanced'
      default:
        return 'badge-beginner'
    }
  }

  const getDifficultyLabel = () => {
    return metadata?.difficulty?.value || metadata?.difficulty?.key || 'Beginner'
  }

  // Calculate total duration
  const totalMinutes = lessons.reduce((total, lesson) => {
    return total + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="py-12">
      {/* Track course view */}
      <CourseViewTracker 
        slug={course.slug} 
        title={metadata?.title || course.title}
        thumbnail={metadata?.thumbnail?.imgix_url}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm">
              <Link href="/courses" className="text-navy-400 hover:text-primary-400 transition-colors">
                Courses
              </Link>
              <span className="mx-2 text-navy-600">/</span>
              <span className="text-navy-200">{metadata?.title || course.title}</span>
            </nav>

            {/* Course Header */}
            <div className="mb-8">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-4xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4">
                <span className={`badge ${getDifficultyClass()}`}>
                  {getDifficultyLabel()}
                </span>
                {metadata?.is_free && (
                  <span className="badge badge-free">Free</span>
                )}
                {totalMinutes > 0 && (
                  <span className="text-navy-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                  </span>
                )}
                <span className="text-navy-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                </span>
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
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose max-w-none">
                  <ReactMarkdown>{metadata.description}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Lessons List */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                <div className="space-y-4">
                  {lessons
                    .sort((a, b) => (a.metadata?.order ?? 999) - (b.metadata?.order ?? 999))
                    .map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-primary-400 font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 line-clamp-1 mt-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-400">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
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
                    <div className="text-4xl font-bold text-green-400">Free</div>
                  ) : metadata?.price ? (
                    <div className="text-4xl font-bold text-white">${metadata.price}</div>
                  ) : (
                    <div className="text-4xl font-bold text-green-400">Free</div>
                  )}
                </div>
                
                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${course.slug}/lessons/${lessons[0]?.slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}
                
                <div className="space-y-3 text-sm">
                  {metadata?.estimated_hours && (
                    <div className="flex justify-between text-navy-300">
                      <span>Duration</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  <div className="flex justify-between text-navy-300">
                    <span>Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  <div className="flex justify-between text-navy-300">
                    <span>Difficulty</span>
                    <span className="text-white">{getDifficultyLabel()}</span>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="card p-6">
                  <h3 className="font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        {instructor.metadata?.photo?.imgix_url ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center text-xl">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-xs text-navy-400 line-clamp-1">
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
    </div>
  )
}