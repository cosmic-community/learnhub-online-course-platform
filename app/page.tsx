import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'

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
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-20">📚</div>
        <div className="absolute top-40 right-20 text-3xl animate-float opacity-20" style={{ animationDelay: '1s' }}>💻</div>
        <div className="absolute bottom-20 left-1/4 text-3xl animate-float opacity-20" style={{ animationDelay: '0.5s' }}>🎯</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm mb-6 animate-pulse-slow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              {totalLessons}+ lessons available
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg glow-hover">
                Browse Courses
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
      <section className="py-12 -mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <LearningStreak />
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

      {/* Quick Tips Section - NEW! */}
      <section className="py-16 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">💡 Daily Learning Tips</h2>
            <p className="text-navy-400">Pro tips to maximize your learning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 group hover:border-primary-500/50 transition-all">
              <div className="text-3xl mb-4 group-hover:animate-bounce">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Set Small Goals</h3>
              <p className="text-navy-400 text-sm">Complete just one lesson a day. Consistency beats intensity!</p>
            </div>
            <div className="card p-6 group hover:border-primary-500/50 transition-all">
              <div className="text-3xl mb-4 group-hover:animate-bounce">📝</div>
              <h3 className="text-lg font-semibold text-white mb-2">Take Notes</h3>
              <p className="text-navy-400 text-sm">Writing reinforces learning. Keep a coding journal!</p>
            </div>
            <div className="card p-6 group hover:border-primary-500/50 transition-all">
              <div className="text-3xl mb-4 group-hover:animate-bounce">🔁</div>
              <h3 className="text-lg font-semibold text-white mb-2">Practice Daily</h3>
              <p className="text-navy-400 text-sm">Type out code examples. Muscle memory is powerful!</p>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10" />
            
            <div className="relative">
              <div className="text-5xl mb-4 animate-float">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <Link href="/courses" className="btn-primary text-lg glow">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}