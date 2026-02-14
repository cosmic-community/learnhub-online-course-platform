// app/courses/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseBySlug } from '@/lib/cosmic'
import MarkdownContent from '@/components/MarkdownContent'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import LearningProgress from '@/components/LearningProgress'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
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
  const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.metadata?.duration_minutes || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <span>/</span>
                <span className="text-navy-300">{course.title}</span>
              </nav>

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

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>

              {metadata?.tagline && (
                <p className="text-xl text-navy-300 mb-6">
                  {metadata.tagline}
                </p>
              )}

              {/* Meta Info */}
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
                {totalDuration > 0 && (
                  <span className="flex items-center gap-2 text-navy-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.round(totalDuration / 60)}h {totalDuration % 60}m total
                  </span>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-navy-400 text-sm">Taught by:</span>
                  <div className="flex items-center gap-3">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                            👨‍🏫
                          </div>
                        )}
                        <span className="text-sm font-medium">
                          {instructor.metadata?.name || instructor.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                {/* Thumbnail */}
                {metadata?.thumbnail && (
                  <div className="aspect-video rounded-xl overflow-hidden mb-6">
                    <img
                      src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Progress Tracker */}
                <div className="mb-6 p-4 bg-navy-800/50 rounded-xl">
                  <LearningProgress courseSlug={slug} totalLessons={lessons.length} />
                </div>

                {/* Price */}
                <div className="mb-6">
                  {metadata?.is_free ? (
                    <div className="text-3xl font-bold text-primary-400">Free</div>
                  ) : (
                    <div className="text-3xl font-bold text-white">${metadata?.price || 0}</div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {lessons.length > 0 && lessons[0] && (
                    <Link
                      href={`/courses/${slug}/lessons/${lessons[0].slug}`}
                      className="btn-primary w-full justify-center"
                    >
                      Start Learning
                    </Link>
                  )}
                </div>

                {/* Course Info */}
                <div className="mt-6 pt-6 border-t border-navy-700 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-navy-400">Lessons</span>
                    <span className="text-white">{lessons.length}</span>
                  </div>
                  {metadata?.estimated_hours && (
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-400">Duration</span>
                      <span className="text-white">{metadata.estimated_hours} hours</span>
                    </div>
                  )}
                  {metadata?.difficulty && (
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-400">Level</span>
                      <span className="text-white">{metadata.difficulty.value}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
              {metadata?.description ? (
                <div className="prose max-w-none">
                  <MarkdownContent content={metadata.description} />
                </div>
              ) : (
                <p className="text-navy-400">No description available.</p>
              )}
            </div>

            {/* Instructor Details */}
            {instructors.length > 0 && instructors[0] && (
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-bold text-white mb-6">Your Instructor</h2>
                <div className="card p-6">
                  <Link
                    href={`/instructors/${instructors[0].slug}`}
                    className="flex items-center gap-4 mb-4 group"
                  >
                    {instructors[0].metadata?.photo ? (
                      <img
                        src={`${instructors[0].metadata.photo.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                        alt={instructors[0].metadata?.name || instructors[0].title}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-navy-700 flex items-center justify-center text-2xl">
                        👨‍🏫
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {instructors[0].metadata?.name || instructors[0].title}
                      </div>
                      {instructors[0].metadata?.credentials && (
                        <div className="text-sm text-navy-400">
                          {instructors[0].metadata.credentials}
                        </div>
                      )}
                    </div>
                  </Link>
                  {instructors[0].metadata?.bio && (
                    <p className="text-navy-300 text-sm line-clamp-4">
                      {instructors[0].metadata.bio}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Course Curriculum</h2>
          <LessonList lessons={lessons} courseSlug={slug} />
        </div>
      </section>
    </div>
  )
}