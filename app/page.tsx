import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import MotivationalQuote from '@/components/MotivationalQuote'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total learning hours from all courses
  const totalHours = courses.reduce((sum, course) => sum + (course.metadata?.estimated_hours || 0), 0)
  const totalLessons = courses.reduce((sum, course) => sum + (course.metadata?.lessons?.length || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Learning Streak Component */}
            <LearningStreak />
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg group">
                <span className="mr-2">🚀</span>
                Browse Courses
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats with animations */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="stat-card text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="counter">{courses.length}</span>+
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="stat-card text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="counter">{totalLessons}</span>+
              </div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="stat-card text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="counter">{instructors.length}</span>+
              </div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="stat-card text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="counter">{totalHours}</span>h
              </div>
              <div className="text-navy-400 text-sm">Of Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Motivation Quote */}
      <section className="py-8 bg-gradient-to-r from-primary-500/10 via-navy-900/50 to-primary-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotivationalQuote />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl animate-bounce-slow">⭐</span>
                <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
              </div>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/courses" className="btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Achievement Badges Preview */}
      <section className="py-16 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">🏆 Earn Achievements As You Learn</h2>
            <p className="text-navy-400">Complete courses and unlock exclusive badges</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="achievement-badge achievement-unlocked">
              <span className="text-3xl">🎯</span>
              <span className="text-xs text-navy-300 mt-1">First Step</span>
            </div>
            <div className="achievement-badge achievement-unlocked">
              <span className="text-3xl">📚</span>
              <span className="text-xs text-navy-300 mt-1">Bookworm</span>
            </div>
            <div className="achievement-badge achievement-unlocked">
              <span className="text-3xl">🔥</span>
              <span className="text-xs text-navy-300 mt-1">On Fire</span>
            </div>
            <div className="achievement-badge achievement-locked">
              <span className="text-3xl opacity-50">💎</span>
              <span className="text-xs text-navy-500 mt-1">Diamond</span>
            </div>
            <div className="achievement-badge achievement-locked">
              <span className="text-3xl opacity-50">🏅</span>
              <span className="text-xs text-navy-500 mt-1">Champion</span>
            </div>
            <div className="achievement-badge achievement-locked">
              <span className="text-3xl opacity-50">👑</span>
              <span className="text-xs text-navy-500 mt-1">Master</span>
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
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <CategoryCard category={category} />
              </div>
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
            {instructors.map((instructor, index) => (
              <div 
                key={instructor.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10 animate-pulse-slow" />
            
            <div className="relative">
              <span className="text-5xl mb-4 block animate-bounce-slow">🎓</span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg inline-flex items-center gap-2 group">
                <span>Get Started Now</span>
                <span className="group-hover:translate-x-1 transition-transform">🚀</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}