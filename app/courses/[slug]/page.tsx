// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug, getCourses } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import ProgressTracker from '@/components/ProgressTracker'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const { metadata } = course
  const instructors = metadata?.instructors || []
  const categories = metadata?.categories || []
  const lessons = metadata?.lessons || []
  const lessonSlugs = lessons.map(l => l.slug)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <div>
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="text-sm text-navy-400 hover:text-primary-400 transition-colors"
                    >
                      {category.metadata?.icon} {category.metadata?.name || category.title}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                
                <span className="flex items-center gap-2 text-navy-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>

                {metadata?.estimated_hours && (
                  <span className="flex items-center gap-2 text-navy-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {metadata.estimated_hours} hours
                  </span>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                {lessons.length > 0 && (
                  <Link
                    href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                    className="btn-primary text-lg"
                  >
                    Start Learning
                  </Link>
                )}
                
                <div className="text-2xl font-bold text-white">
                  {metadata?.is_free ? (
                    <span className="text-primary-400">Free</span>
                  ) : (
                    <span>${metadata?.price || 0}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative">
              {metadata?.thumbnail ? (
                <img
                  src={`${metadata.thumbnail.imgix_url}?w=1200&h=675&fit=crop&auto=format,compress`}
                  alt={course.title}
                  width={600}
                  height={338}
                  className="w-full rounded-2xl shadow-2xl shadow-navy-950/50"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl flex items-center justify-center">
                  <span className="text-8xl">📚</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            {metadata?.description && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose prose-lg">
                  <MarkdownContent content={metadata.description} />
                </div>
              </div>
            )}

            {/* Lessons */}
            {lessons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
                <LessonList lessons={lessons} courseSlug={slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress Tracker */}
              {lessons.length > 0 && (
                <ProgressTracker 
                  courseSlug={slug} 
                  totalLessons={lessons.length}
                  lessonSlugs={lessonSlugs}
                />
              )}
              
              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="bg-navy-800/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                  </h3>
                  <div className="space-y-4">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-4 group"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=96&h=96&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy-700 flex items-center justify-center">
                            👨‍🏫
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white group-hover:text-primary-400 transition-colors">
                            {instructor.metadata?.name || instructor.title}
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

              {/* Quick Info */}
              <div className="bg-navy-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Course Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white font-medium">{lessons.length}</span>
                  </div>
                  {metadata?.estimated_hours && (
                    <div className="flex items-center justify-between">
                      <span className="text-navy-400">Duration</span>
                      <span className="text-white font-medium">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  {metadata?.difficulty && (
                    <div className="flex items-center justify-between">
                      <span className="text-navy-400">Level</span>
                      <DifficultyBadge difficulty={metadata.difficulty} size="small" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Price</span>
                    <span className="text-white font-medium">
                      {metadata?.is_free ? 'Free' : `$${metadata?.price || 0}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}