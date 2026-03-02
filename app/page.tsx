import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)

  // Calculate total learning hours
  const totalLessons = courses.reduce((acc, course) => {
    const lessons = course.metadata?.lessons
    return acc + (Array.isArray(lessons) ? lessons.length : 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-float opacity-10">📚</div>
          <div className="absolute top-40 right-20 text-5xl animate-float-delay opacity-10">💻</div>
          <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-10">🎯</div>
          <div className="absolute bottom-40 right-1/3 text-5xl animate-float-delay opacity-10">🚀</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
              <span className="animate-pulse text-primary-400">●</span>
              <span className="text-sm text-primary-300">Start learning today — build your streak!</span>
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
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{totalLessons}+</div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{categories.length}</div>
              <div className="text-navy-400 text-sm">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🌟</span>
                <span className="text-primary-400 font-medium text-sm uppercase tracking-wider">Hand-picked for you</span>
              </div>
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

      {/* Daily Tip Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 border border-primary-500/30 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-4xl">💡</div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Pro Tip: Consistency is Key!</h3>
                <p className="text-navy-300">
                  Studies show that learning for just 20 minutes daily leads to better retention than 2-hour weekend sessions. 
                  Build your learning streak and watch your skills grow! 
                </p>
              </div>
              <Link 
                href="/courses" 
                className="btn-primary whitespace-nowrap"
              >
                Start Learning
              </Link>
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

      {/* Achievement Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 border border-navy-700 rounded-3xl p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Track Your Progress <span className="text-primary-400">& Stay Motivated</span>
                </h2>
                <p className="text-navy-300 mb-6">
                  Our learning streak feature helps you build consistent learning habits. 
                  See your daily progress, unlock achievements, and get inspired with daily motivational quotes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-navy-200">
                    <span className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400">🔥</span>
                    Build daily learning streaks
                  </li>
                  <li className="flex items-center gap-3 text-navy-200">
                    <span className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400">🏆</span>
                    Unlock milestone achievements
                  </li>
                  <li className="flex items-center gap-3 text-navy-200">
                    <span className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400">💡</span>
                    Get daily motivational quotes
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 w-full max-w-sm">
                  <div className="text-center mb-4">
                    <span className="text-5xl">🔥</span>
                    <h3 className="text-2xl font-bold text-white mt-2">7 Day Streak!</h3>
                    <p className="text-navy-400 text-sm">Amazing consistency!</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-navy-700/50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-primary-400">7</div>
                      <div className="text-xs text-navy-400">Current</div>
                    </div>
                    <div className="bg-navy-700/50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-yellow-400">14</div>
                      <div className="text-xs text-navy-400">Longest</div>
                    </div>
                    <div className="bg-navy-700/50 rounded-xl p-3 text-center">
                      <div className="text-xl font-bold text-green-400">23</div>
                      <div className="text-xs text-navy-400">Total</div>
                    </div>
                  </div>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" />
                  </div>
                  <p className="text-xs text-navy-400 text-center mt-2">Progress to 14-day milestone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <span className="text-5xl mb-4 block">🚀</span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
                Your first day streak starts now!
              </p>
              <Link href="/courses" className="btn-primary text-lg">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}