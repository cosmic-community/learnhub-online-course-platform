import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import DailyTip from '@/components/DailyTip'
import SparkleButton from '@/components/SparkleButton'
import LearningStreak from '@/components/LearningStreak'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  
  // Calculate total lessons across all courses
  const totalLessons = courses.reduce((acc, course) => {
    const lessonCount = course.metadata?.lessons?.length ?? 0
    return acc + lessonCount
  }, 0)

  // Calculate total hours
  const totalHours = courses.reduce((acc, course) => {
    return acc + (course.metadata?.estimated_hours ?? 0)
  }, 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Animated background shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-primary-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-40 right-1/4 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          {/* Learning Streak Badge */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <LearningStreak />
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-purple-400 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Master web development, design, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <SparkleButton href="/courses" className="btn-primary text-lg glow-on-hover">
                Browse Courses
              </SparkleButton>
              <Link href="/categories" className="btn-secondary text-lg">
                Explore Categories
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto stagger-children">
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <AnimatedCounter 
                end={courses.length} 
                suffix="+" 
                className="text-3xl font-bold text-white"
              />
              <div className="text-navy-400 text-sm mt-1">Courses</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <AnimatedCounter 
                end={totalLessons} 
                suffix="+" 
                className="text-3xl font-bold text-white"
              />
              <div className="text-navy-400 text-sm mt-1">Lessons</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <AnimatedCounter 
                end={totalHours} 
                suffix="h" 
                className="text-3xl font-bold text-white"
              />
              <div className="text-navy-400 text-sm mt-1">Content</div>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl border border-navy-800/50 hover:border-primary-500/30 transition-colors">
              <AnimatedCounter 
                end={instructors.length} 
                suffix="+" 
                className="text-3xl font-bold text-white"
              />
              <div className="text-navy-400 text-sm mt-1">Experts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Learning Tip */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <DailyTip />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">✨</span>
                <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                  Hand-picked for you
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Courses</h2>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All Courses
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
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
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                Find Your Path
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Benefits Section */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Why Learn With Us?</h2>
            <p className="text-navy-400">Everything you need to succeed in your learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            <div className="text-center p-8 bg-navy-900/50 rounded-2xl border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Learn by Doing</h3>
              <p className="text-navy-400">
                Hands-on projects and real-world exercises that help you apply what you learn immediately.
              </p>
            </div>
            
            <div className="text-center p-8 bg-navy-900/50 rounded-2xl border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                👨‍🏫
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Instructors</h3>
              <p className="text-navy-400">
                Learn from industry professionals with years of real-world experience.
              </p>
            </div>
            
            <div className="text-center p-8 bg-navy-900/50 rounded-2xl border border-navy-800 hover:border-primary-500/30 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                ⏰
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Learn at Your Pace</h3>
              <p className="text-navy-400">
                Access courses anytime, anywhere. Learn on your schedule, not ours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🌟</span>
              <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                Industry Experts
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden glow-on-hover">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="text-5xl mb-4 animate-float">🎓</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <SparkleButton href="/courses" className="btn-primary text-lg animate-pulse-ring">
                Get Started Now
              </SparkleButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}