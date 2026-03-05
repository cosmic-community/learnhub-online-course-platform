import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import QuickStartCard from '@/components/QuickStartCard'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const totalLessons = courses.reduce((acc, course) => {
    return acc + (course.metadata?.lessons?.length || 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 text-primary-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                {totalLessons}+ lessons available
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Learn skills that
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
              </h1>
              <p className="text-xl text-navy-300 mb-8">
                Master web development, design, and more with expert-led courses. 
                Track your progress and build a learning streak!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/courses" className="btn-primary text-lg group">
                  Browse Courses
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/categories" className="btn-secondary text-lg">
                  Explore Categories
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">{courses.length}+</div>
                  <div className="text-navy-400 text-sm">Courses</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">{instructors.length}+</div>
                  <div className="text-navy-400 text-sm">Instructors</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">{categories.length}</div>
                  <div className="text-navy-400 text-sm">Categories</div>
                </div>
              </div>
            </div>
            
            {/* Right side - Learning Streak Widget */}
            <div className="hidden lg:block">
              <LearningStreak />
              <div className="mt-6">
                <QuickStartCard courses={courses} />
              </div>
            </div>
          </div>
          
          {/* Mobile Learning Streak */}
          <div className="lg:hidden mt-12 max-w-md mx-auto">
            <LearningStreak />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
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

      {/* Daily Challenge Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <span className="text-4xl">🎯</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Daily Learning Challenge</h3>
                </div>
                <p className="text-white/90 text-lg max-w-xl">
                  Complete just one lesson today to maintain your streak and unlock achievements!
                </p>
              </div>
              <Link 
                href="/courses" 
                className="whitespace-nowrap bg-white text-primary-600 hover:bg-white/90 font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Start Today&apos;s Lesson
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

      {/* Achievement Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Unlock Achievements</h2>
            <p className="text-navy-400">Track your progress and earn rewards as you learn</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: '🌱', title: 'First Steps', desc: 'Complete your first lesson', unlocked: true },
              { emoji: '🔥', title: 'Week Warrior', desc: '7 day learning streak', unlocked: false },
              { emoji: '📚', title: 'Bookworm', desc: 'Complete 10 lessons', unlocked: false },
              { emoji: '🏆', title: 'Champion', desc: '30 day learning streak', unlocked: false },
            ].map((achievement, i) => (
              <div 
                key={i}
                className={`card p-6 text-center transition-all ${
                  achievement.unlocked 
                    ? 'border-primary-500/30 bg-primary-500/5' 
                    : 'opacity-60 grayscale'
                }`}
              >
                <div className="text-4xl mb-3">{achievement.emoji}</div>
                <h3 className="font-semibold text-white mb-1">{achievement.title}</h3>
                <p className="text-sm text-navy-400">{achievement.desc}</p>
                {achievement.unlocked && (
                  <div className="mt-3 text-xs text-primary-400 font-medium">✓ Unlocked</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-navy-300 mb-8 text-lg">
              Join thousands of students and start your journey to mastering new skills today.
              Build your streak and unlock achievements along the way!
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