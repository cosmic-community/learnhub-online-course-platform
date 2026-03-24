import Link from 'next/link'
import { getCourses, getCategories, getInstructors, getLessons } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import QuickStats from '@/components/QuickStats'
import AchievementPopup from '@/components/AchievementPopup'

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
      {/* Achievement Popup */}
      <AchievementPopup />
      
      {/* Quick Stats Widget */}
      <QuickStats 
        totalCourses={courses.length} 
        totalLessons={lessons.length}
        totalInstructors={instructors.length}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-primary-400 text-sm font-medium">New courses added weekly</span>
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
                Browse Courses
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{courses.length}+</div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{instructors.length}+</div>
              <div className="text-navy-400 text-sm">Instructors</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{categories.length}</div>
              <div className="text-navy-400 text-sm">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Streak Section - NEW! */}
      <section className="py-12 bg-gradient-to-b from-navy-950 to-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-2xl animate-bounce-slow">
                    🎓
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Welcome to LearnHub</h2>
                    <p className="text-navy-400">Your personalized learning dashboard</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800 transition-colors group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                    <div className="text-2xl font-bold text-white">{courses.length}</div>
                    <div className="text-navy-400 text-xs">Total Courses</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800 transition-colors group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📖</div>
                    <div className="text-2xl font-bold text-white">{lessons.length}</div>
                    <div className="text-navy-400 text-xs">Total Lessons</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800 transition-colors group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👨‍🏫</div>
                    <div className="text-2xl font-bold text-white">{instructors.length}</div>
                    <div className="text-navy-400 text-xs">Instructors</div>
                  </div>
                  <div className="bg-navy-800/50 rounded-xl p-4 text-center hover:bg-navy-800 transition-colors group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏷️</div>
                    <div className="text-2xl font-bold text-white">{categories.length}</div>
                    <div className="text-navy-400 text-xs">Categories</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="badge bg-green-500/20 text-green-400">
                    <span className="mr-1">✓</span> Beginner Friendly
                  </span>
                  <span className="badge bg-blue-500/20 text-blue-400">
                    <span className="mr-1">🎥</span> Video Content
                  </span>
                  <span className="badge bg-purple-500/20 text-purple-400">
                    <span className="mr-1">💻</span> Code Examples
                  </span>
                  <span className="badge bg-orange-500/20 text-orange-400">
                    <span className="mr-1">📝</span> Written Guides
                  </span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <LearningStreak />
            </div>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500" />
            
            <div className="text-5xl mb-6 animate-bounce-slow">🚀</div>
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