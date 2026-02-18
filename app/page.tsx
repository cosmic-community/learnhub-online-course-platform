import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStats from '@/components/LearningStats'
import DailyTip from '@/components/DailyTip'
import QuickSearch from '@/components/QuickSearch'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const totalLessons = courses.reduce((acc, course) => acc + (course.metadata?.lessons?.length || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Quick Search */}
            <div className="flex justify-center mb-8">
              <QuickSearch courses={courses} categories={categories} />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg">
                Browse Courses
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Stats & Daily Tip Section */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LearningStats 
              totalCourses={courses.length} 
              totalLessons={totalLessons}
              totalInstructors={instructors.length}
            />
            <div className="flex flex-col gap-6">
              <DailyTip />
              
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-6 text-center group hover:border-primary-500/50 transition-all">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🎯</div>
                  <p className="text-2xl font-bold text-white">{courses.length}</p>
                  <p className="text-navy-400 text-sm">Total Courses</p>
                </div>
                <div className="card p-6 text-center group hover:border-primary-500/50 transition-all">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📖</div>
                  <p className="text-2xl font-bold text-white">{totalLessons}</p>
                  <p className="text-navy-400 text-sm">Total Lessons</p>
                </div>
              </div>
              
              {/* Motivational Quote */}
              <div className="card p-6 bg-gradient-to-br from-navy-900/80 to-navy-800/50">
                <blockquote className="text-lg text-navy-200 italic">
                  "The beautiful thing about learning is that nobody can take it away from you."
                </blockquote>
                <p className="text-primary-400 text-sm mt-3">— B.B. King</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex">
              View All Courses
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-navy-300 mb-8 text-lg">
              Join thousands of students and start your journey to mastering new skills today.
            </p>
            <Link href="/courses" className="btn-primary text-lg">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}