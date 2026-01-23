import { getCourses, getCategories } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryFilter from '@/components/CategoryFilter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Courses - LearnHub',
  description: 'Browse our complete catalog of courses in web development, design, and more.',
}

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories(),
  ])

  const freeCourses = courses.filter(c => c.metadata?.is_free)
  const paidCourses = courses.filter(c => !c.metadata?.is_free)

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">All Courses</h1>
          <p className="text-xl text-navy-300">
            Explore our complete catalog of {courses.length} courses
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter categories={categories} />
        </div>

        {/* Free Courses */}
        {freeCourses.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold text-white">Free Courses</h2>
              <span className="badge badge-free">
                {freeCourses.length} {freeCourses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Paid Courses */}
        {paidCourses.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold text-white">Premium Courses</h2>
              <span className="badge bg-navy-700 text-navy-200">
                {paidCourses.length} {paidCourses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paidCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-navy-400 text-lg">No courses available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}