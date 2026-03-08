// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Lesson, Instructor, Category } from '@/types'
import CourseViewTracker from '@/components/CourseViewTracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return {
      title: 'Course Not Found - LearnHub',
    }
  }

  return {
    title: `${course.metadata?.seo_title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline,
  }
}

function getDifficultyBadgeClass(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'badge-beginner'
    case 'intermediate':
      return 'badge-intermediate'
    case 'advanced':
      return 'badge-advanced'
    default:
      return 'bg-navy-700 text-navy-200'
  }
}

function getDifficultyValue(difficulty: unknown): string {
  if (!difficulty) return 'Beginner'
  if (typeof difficulty === 'string') return difficulty
  if (typeof difficulty === 'object' && difficulty !== null && 'value' in difficulty) {
    return String((difficulty as { value: unknown }).value)
  }
  return 'Beginner'
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const lessons = (metadata?.lessons || []) as Lesson[]
  const instructors = (metadata?.instructors || []) as Instructor[]
  const categories = (metadata?.categories || []) as Category[]
  const difficulty = getDifficultyValue(metadata?.difficulty)
  const thumbnailUrl = metadata?.thumbnail?.imgix_url

  // Calculate total duration
  const totalMinutes = lessons.reduce((acc, lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="py-12">
      {/* Course View Tracker - tracks this course view */}
      <CourseViewTracker 
        courseSlug={course.slug}
        courseTitle={course.title}
        courseThumbnail={thumbnailUrl}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-navy-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li>
              <Link href="/courses" className="text-navy-400 hover:text-white transition-colors">
                Courses
              </Link>
            </li>
            <li className="text-navy-600">/</li>
            <li className="text-white">{course.title}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero */}
            <div className="card mb-8">
              {thumbnailUrl && (
                <div className="aspect-video relative">
                  <img
                    src={`${thumbnailUrl}?w=1600&h=900&fit=crop&auto=format,compress`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`badge ${getDifficultyBadgeClass(difficulty)}`}>
                    {difficulty}
                  </span>
                  {metadata?.is_free && (
                    <span className="badge badge-free">Free</span>
                  )}
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="badge bg-navy-700 text-navy-200 hover:bg-navy-600 transition-colors"
                    >
                      {cat.metadata?.icon} {cat.metadata?.name || cat.title}
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {metadata?.title || course.title}
                </h1>
                {metadata?.tagline && (
                  <p className="text-xl text-navy-300">{metadata.tagline}</p>
                )}
              </div>
            </div>

            {/* Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose">
                  {metadata.description.split('\n').map((paragraph, idx) => {
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
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Content ({lessons.length} lessons)
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 bg-navy-800/50 rounded-lg hover:bg-navy-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors truncate">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 truncate">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-500 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
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
                <button className="btn-primary w-full mb-4">
                  {metadata?.is_free ? 'Start Learning' : 'Enroll Now'}
                </button>
                <div className="space-y-3 text-sm">
                  {metadata?.estimated_hours && (
                    <div className="flex items-center justify-between">
                      <span className="text-navy-400">Duration</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  {totalMinutes > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-navy-400">Total Time</span>
                      <span className="text-white">
                        {hours > 0 ? `${hours}h ` : ''}{minutes}m
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Level</span>
                    <span className="text-white">{difficulty}</span>
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
                        <div className="w-12 h-12 rounded-full bg-navy-700 overflow-hidden">
                          {instructor.metadata?.photo?.imgix_url ? (
                            <img
                              src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                              alt={instructor.metadata?.name || instructor.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">
                              👨‍🏫
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
                          </div>
                          {instructor.metadata?.credentials && (
                            <div className="text-sm text-navy-400 truncate max-w-[200px]">
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