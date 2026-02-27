import Link from 'next/link'
import { getCourses, getCategories, getInstructors, getLessons } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import QuickStats from '@/components/QuickStats'

export default async function HomePage() {
  const [courses, categories, instructors, lessons] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
    getLessons(),
  ])

  const featuredCourses = courses.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
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
          
          {/* Quick Stats */}
          <div className="mt-16 max-w-4xl mx-auto">
            <QuickStats 
              totalCourses={courses.length}
              totalLessons={lessons.length}
              totalInstructors={instructors.length}
            />
          </div>
        </div>
      </section>

      {/* Learning Streak Section - Personal Dashboard */}
      <section className="py-12 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Streak Tracker */}
            <div className="lg:col-span-1">
              <LearningStreak />
            </div>
            
            {/* Motivational Card */}
            <div className="lg:col-span-2">
              <div className="card p-6 h-full flex flex-col justify-center">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💡</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Pro Tip: Build Consistency</h3>
                    <p className="text-navy-300 mb-4">
                      Learning a little bit every day is more effective than cramming. Even 15 minutes of focused 
                      study builds neural pathways and helps information stick in your long-term memory.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm">🎯 Set daily goals</span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">⏰ Same time daily</span>
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm">🏆 Celebrate wins</span>
                    </div>
                  </div>
                </div>
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
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-navy-300 mb-8 text-lg">
              Join thousands of students and start your journey to mastering new skills today.
              Build your streak and track your progress as you learn!
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