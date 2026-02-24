import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import DailyQuote from '@/components/DailyQuote'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-float-slow" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-primary-500/20 rounded-full animate-float-medium" />
          <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-primary-300/25 rounded-full animate-float-fast" />
          <div className="absolute top-60 right-1/3 w-4 h-4 bg-primary-400/15 rounded-full animate-float-slow" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Learning Streak Widget */}
            <LearningStreak />
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-4">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            
            {/* Daily Motivational Quote */}
            <DailyQuote />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/courses" className="btn-primary text-lg group">
                <span>Browse Courses</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats with animated counters */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="inline-block animate-count-up">{courses.length}</span>+
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
              <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full animate-progress-bar" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="inline-block animate-count-up">{instructors.length}</span>+
              </div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
              <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-progress-bar" style={{ width: '70%', animationDelay: '0.2s' }} />
              </div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <span className="inline-block animate-count-up">{categories.length}</span>
              </div>
              <div className="text-navy-400 text-sm">Categories</div>
              <div className="mt-2 h-1 bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-progress-bar" style={{ width: '60%', animationDelay: '0.4s' }} />
              </div>
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
                <span className="text-2xl">🔥</span>
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Popular Now</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
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

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-navy-800/50 rounded-full px-4 py-2 mb-4">
              <span className="text-xl">🎯</span>
              <span className="text-navy-300 text-sm">Find Your Path</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
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
            <div className="inline-flex items-center gap-2 bg-navy-800/50 rounded-full px-4 py-2 mb-4">
              <span className="text-xl">⭐</span>
              <span className="text-navy-300 text-sm">World-Class Experts</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div 
                key={instructor.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-primary-500/10 animate-gradient-x" />
            
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg inline-flex items-center gap-2 group">
                Get Started Now
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}