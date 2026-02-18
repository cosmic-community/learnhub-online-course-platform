import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import LearningStreak from '@/components/LearningStreak'
import AnimatedCounter from '@/components/AnimatedCounter'
import Testimonials from '@/components/Testimonials'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total lessons and hours
  const totalLessons = courses.reduce((acc, course) => acc + (course.metadata?.lessons?.length || 0), 0)
  const totalHours = courses.reduce((acc, course) => acc + (course.metadata?.estimated_hours || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>💻</div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🚀</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-6">
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
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
              </Link>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={courses.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Courses</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={totalLessons} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Lessons</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={instructors.length} suffix="+" />
              </div>
              <div className="text-navy-400 text-sm">Expert Instructors</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                <AnimatedCounter end={totalHours} suffix="h" />
              </div>
              <div className="text-navy-400 text-sm">of Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Streak Section - NEW! */}
      <section className="py-12 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <LearningStreak />
            </div>
            <div className="lg:col-span-2">
              <div className="card p-6 h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-white mb-2">🎯 Build Your Learning Habit</h3>
                <p className="text-navy-300 mb-4">
                  Consistency is key to mastering new skills. Our streak system helps you stay motivated 
                  and track your progress over time. Even 15 minutes a day can make a huge difference!
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-navy-400">
                    <span className="text-lg">📈</span>
                    <span>Track daily progress</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy-400">
                    <span className="text-lg">🏆</span>
                    <span>Earn achievements</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-navy-400">
                    <span className="text-lg">🎮</span>
                    <span>Stay motivated</span>
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
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Featured</span>
              <h2 className="text-3xl font-bold text-white mt-1 mb-2">Popular Courses</h2>
              <p className="text-navy-400">Hover over cards to try a quick quiz! 🎯</p>
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

      {/* Testimonials - NEW! */}
      <Testimonials />

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Explore</span>
            <h2 className="text-3xl font-bold text-white mt-1 mb-2">Browse by Category</h2>
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
            <span className="text-primary-400 text-sm font-medium uppercase tracking-wide">Experts</span>
            <h2 className="text-3xl font-bold text-white mt-1 mb-2">Meet Our Instructors</h2>
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
          <div className="card p-12 bg-gradient-to-br from-primary-500/10 via-navy-900/50 to-navy-950 border-primary-500/20">
            <span className="text-5xl mb-4 inline-block animate-bounce">🚀</span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to start learning?
            </h2>
            <p className="text-navy-300 mb-8 text-lg">
              Join thousands of students and start your journey to mastering new skills today.
              Your future self will thank you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="btn-primary text-lg">
                Get Started Now
              </Link>
              <Link href="/contact" className="btn-secondary text-lg">
                Have Questions?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}