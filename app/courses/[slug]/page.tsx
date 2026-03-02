// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import ReactMarkdown from 'react-markdown'
import LessonProgressTracker from '@/components/LessonProgressTracker'
import type { Metadata } from 'next'
import type { Lesson } from '@/types'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return { title: 'Course Not Found - LearnHub' }
  }

  return {
    title: course.metadata?.seo_title || `${course.metadata?.title || course.title} - LearnHub`,
    description: course.metadata?.seo_description || course.metadata?.tagline,
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
  const difficulty = metadata?.difficulty?.value || 'beginner'
  const isFree = metadata?.is_free

  const getDifficultyBadge = () => {
    switch (difficulty.toLowerCase()) {
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

  const totalDuration = lessons.reduce((acc: number, lesson: Lesson) => {
    return acc + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
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

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {metadata?.title || course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4">
                <span className={`badge ${getDifficultyBadge()}`}>
                  {difficulty}
                </span>
                {isFree && <span className="badge badge-free">Free</span>}
                {metadata?.estimated_hours && (
                  <span className="text-navy-400 text-sm">
                    ⏱️ {metadata.estimated_hours} hours
                  </span>
                )}
                <span className="text-navy-400 text-sm">
                  📚 {lessons.length} lessons
                </span>
                {totalDuration > 0 && (
                  <span className="text-navy-400 text-sm">
                    🎬 {Math.round(totalDuration)} min total
                  </span>
                )}
              </div>
            </div>

            {/* Course Thumbnail */}
            {metadata?.thumbnail?.imgix_url && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1600&h=900&fit=crop&auto=format,compress`}
                  alt={metadata.title || course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Course Description */}
            {metadata?.description && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                <div className="prose max-w-none">
                  <ReactMarkdown>{metadata.description}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Instructors */}
            {instructors.length > 0 && (
              <div className="card p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {instructors.length === 1 ? 'Your Instructor' : 'Your Instructors'}
                </h2>
                <div className="space-y-6">
                  {instructors.map((instructor) => (
                    <div key={instructor.id} className="flex gap-4">
                      {instructor.metadata?.photo?.imgix_url ? (
                        <img
                          src={`${instructor.metadata.photo.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                          alt={instructor.metadata?.name || instructor.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-navy-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">👨‍🏫</span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {instructor.metadata?.name || instructor.title}
                        </h3>
                        {instructor.metadata?.credentials && (
                          <p className="text-sm text-primary-400 mb-2">
                            {instructor.metadata.credentials}
                          </p>
                        )}
                        {instructor.metadata?.bio && (
                          <p className="text-navy-400 text-sm line-clamp-3">
                            {instructor.metadata.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lessons List - Full */}
            {lessons.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
                <div className="space-y-2">
                  {lessons.map((lesson: Lesson, index: number) => (
                    <Link
                      key={lesson.id}
                      href={`/courses/${slug}/lessons/${lesson.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-navy-800/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center text-navy-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {lesson.metadata?.title || lesson.title}
                        </h3>
                        {lesson.metadata?.description && (
                          <p className="text-sm text-navy-400 line-clamp-1">
                            {lesson.metadata.description}
                          </p>
                        )}
                      </div>
                      {lesson.metadata?.duration_minutes && (
                        <span className="text-sm text-navy-500">
                          {lesson.metadata.duration_minutes} min
                        </span>
                      )}
                      <svg className="w-5 h-5 text-navy-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              {/* Progress Tracker */}
              <LessonProgressTracker 
                courseSlug={slug}
                lessons={lessons}
              />

              {/* Start Course CTA */}
              <div className="card p-6">
                {/* Price */}
                <div className="mb-6">
                  {isFree ? (
                    <div className="text-3xl font-bold text-green-400">Free</div>
                  ) : metadata?.price ? (
                    <div className="text-3xl font-bold text-white">${metadata.price}</div>
                  ) : null}
                </div>

                {/* Start Button */}
                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                    className="btn-primary w-full mb-4"
                  >
                    Start Learning
                  </Link>
                )}

                {/* Course Stats */}
                <div className="space-y-3 pt-4 border-t border-navy-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  {totalDuration > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-400">Total Duration</span>
                      <span className="text-white">{Math.round(totalDuration)} min</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-400">Skill Level</span>
                    <span className="text-white capitalize">{difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}