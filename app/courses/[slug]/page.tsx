// app/courses/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/lib/cosmic'
import DifficultyBadge from '@/components/DifficultyBadge'
import LessonList from '@/components/LessonList'
import MarkdownContent from '@/components/MarkdownContent'
import LearningStreak from '@/components/LearningStreak'

interface CoursePageProps {
  params: Promise<{ slug: string }>
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

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => {
    const orderA = a.metadata?.order ?? 999
    const orderB = b.metadata?.order ?? 999
    return orderA - orderB
  })

  // Calculate total duration
  const totalMinutes = lessons.reduce((sum, lesson) => {
    return sum + (lesson.metadata?.duration_minutes || 0)
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-navy-900/50 border-b border-navy-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <span>/</span>
                <span className="text-navy-300 truncate">{course.title}</span>
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
                <p className="text-xl text-navy-300 mb-6">{metadata.tagline}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-navy-400 mb-6">
                {metadata?.difficulty && (
                  <DifficultyBadge difficulty={metadata.difficulty} />
                )}
                
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lessons.length} lessons
                </span>

                {totalMinutes > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {hours > 0 && `${hours}h `}{minutes > 0 && `${minutes}m`}
                  </span>
                )}
              </div>

              {/* Instructors */}
              {instructors.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-navy-400">Taught by:</span>
                  <div className="flex items-center gap-3">
                    {instructors.map((instructor) => (
                      <Link
                        key={instructor.id}
                        href={`/instructors/${instructor.slug}`}
                        className="flex items-center gap-2 group"
                      >
                        {instructor.metadata?.photo ? (
                          <img
                            src={`${instructor.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                            alt={instructor.metadata?.name || instructor.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border-2 border-navy-700 group-hover:border-primary-500 transition-colors"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-lg border-2 border-navy-700 group-hover:border-primary-500 transition-colors">
                            👨‍🏫
                          </div>
                        )}
                        <span className="text-white group-hover:text-primary-400 transition-colors">
                          {instructor.metadata?.name || instructor.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="lg:col-span-1">
              <div className="card overflow-hidden">
                {metadata?.thumbnail ? (
                  <img
                    src={`${metadata.thumbnail.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    {metadata?.is_free ? (
                      <span className="text-2xl font-bold text-primary-400">Free</span>
                    ) : (
                      <span className="text-2xl font-bold text-white">${metadata?.price || 0}</span>
                    )}
                  </div>

                  {sortedLessons.length > 0 && sortedLessons[0] && (
                    <Link
                      href={`/courses/${course.slug}/lessons/${sortedLessons[0].slug}`}
                      className="btn-primary w-full text-center"
                    >
                      Start Learning
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Streak */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LearningStreak />
      </section>

      {/* Course Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {metadata?.description && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                <div className="prose">
                  <MarkdownContent content={metadata.description} />
                </div>
              </div>
            )}

            {/* Lessons */}
            {sortedLessons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Course Content ({sortedLessons.length} lessons)
                </h2>
                <LessonList lessons={sortedLessons} courseSlug={course.slug} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Features */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lessons.length} video lessons
                </li>
                {totalMinutes > 0 && (
                  <li className="flex items-center gap-3 text-navy-300">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {hours > 0 && `${hours} hours `}{minutes > 0 && `${minutes} minutes`} of content
                  </li>
                )}
                <li className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Practical code examples
                </li>
                <li className="flex items-center gap-3 text-navy-300">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Full lifetime access
                </li>
              </ul>
            </div>

            {/* Instructor Card */}
            {instructors.length > 0 && instructors[0] && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Instructor</h3>
                <Link
                  href={`/instructors/${instructors[0].slug}`}
                  className="flex items-start gap-4 group"
                >
                  {instructors[0].metadata?.photo ? (
                    <img
                      src={`${instructors[0].metadata.photo.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                      alt={instructors[0].metadata?.name || instructors[0].title}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-navy-700 group-hover:border-primary-500 transition-colors"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-navy-700 flex items-center justify-center text-3xl border-2 border-navy-700 group-hover:border-primary-500 transition-colors">
                      👨‍🏫
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                      {instructors[0].metadata?.name || instructors[0].title}
                    </h4>
                    {instructors[0].metadata?.credentials && (
                      <p className="text-sm text-navy-400 mt-1">
                        {instructors[0].metadata.credentials}
                      </p>
                    )}
                  </div>
                </Link>
                {instructors[0].metadata?.bio && (
                  <p className="text-navy-300 text-sm mt-4 line-clamp-3">
                    {instructors[0].metadata.bio}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}