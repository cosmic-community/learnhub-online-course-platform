import Link from 'next/link'
import { getCourses, getCategories, getInstructors, getLessons } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import WelcomeHero from '@/components/WelcomeHero'
import QuickStats from '@/components/QuickStats'
import LearningStreak from '@/components/LearningStreak'

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
      {/* Dynamic Welcome Hero with time-based greeting */}
      <WelcomeHero coursesCount={courses.length} />

      {/* Quick Stats with animated counters */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickStats 
            coursesCount={courses.length}
            instructorsCount={instructors.length}
            categoriesCount={categories.length}
            lessonsCount={lessons.length}
          />
        </div>
      </section>

      {/* Learning Streak Widget + Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Streak Widget - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <LearningStreak />
                
                {/* Daily tip card */}
                <div className="card p-4 mt-4 bg-gradient-to-br from-primary-500/10 to-transparent">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Daily Tip</h4>
                      <p className="text-xs text-navy-400">
                        Consistent daily learning beats occasional marathon sessions. Even 15 minutes a day builds lasting skills!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Courses - Main content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
                  <p className="text-navy-400">Start learning with our most popular courses</p>
                </div>
                <Link href="/courses" className="btn-secondary hidden sm:inline-flex">
                  View All Courses
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
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
      <section className="py-20 bg-navy-900/30">
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

      {/* CTA Section with celebration */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden group">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 animate-bounce">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg group/btn">
                Get Started Now
                <span className="ml-2 group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}