import Link from 'next/link'
import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import CourseCard from '@/components/CourseCard'
import CategoryCard from '@/components/CategoryCard'
import InstructorCard from '@/components/InstructorCard'
import AnimatedCounter from '@/components/AnimatedCounter'
import Testimonials from '@/components/Testimonials'
import ConfettiButton from '@/components/ConfettiButton'
import FloatingEmojis from '@/components/FloatingEmoji'

export default async function HomePage() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  const featuredCourses = courses.slice(0, 3)
  const totalLessons = courses.reduce((acc, course) => acc + (course.metadata?.lessons?.length || 0), 0)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-navy-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
        
        {/* Floating background emojis */}
        <FloatingEmojis />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* New badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-pulse-glow">
              <span className="animate-bounce">🚀</span>
              <span>New courses added weekly!</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Learn skills that
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 animate-gradient"> advance your career</span>
            </h1>
            <p className="text-xl text-navy-300 mb-8">
              Master web development, cloud computing, and more with expert-led courses. 
              Start your learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConfettiButton href="/courses" className="btn-primary text-lg">
                🎯 Browse Courses
              </ConfettiButton>
              <Link href="/categories" className="btn-secondary text-lg group">
                <span>Explore Categories</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Animated Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover-lift">
              <AnimatedCounter end={courses.length} suffix="+" duration={1500} />
              <div className="text-navy-400 text-sm mt-1">Courses</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover-lift">
              <AnimatedCounter end={totalLessons} suffix="+" duration={2000} />
              <div className="text-navy-400 text-sm mt-1">Lessons</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover-lift">
              <AnimatedCounter end={instructors.length} suffix="+" duration={1500} />
              <div className="text-navy-400 text-sm mt-1">Expert Instructors</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-900/30 border border-navy-800 hover-lift">
              <AnimatedCounter end={categories.length} duration={1000} />
              <div className="text-navy-400 text-sm mt-1">Categories</div>
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
                <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
              </div>
              <p className="text-navy-400">Start learning with our most popular courses</p>
            </div>
            <Link href="/courses" className="btn-secondary hidden sm:inline-flex group">
              View All
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div key={course.id} className="hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                <CourseCard course={course} showTrending={index === 0} />
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

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="text-4xl mb-4 block">💬</span>
            <h2 className="text-3xl font-bold text-white mb-2">What Our Students Say</h2>
            <p className="text-navy-400">Join thousands of satisfied learners</p>
          </div>
          
          <div className="card p-8 md:p-12">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-4xl mb-4 block">🎯</span>
            <h2 className="text-3xl font-bold text-white mb-2">Browse by Category</h2>
            <p className="text-navy-400">Find the perfect course for your learning goals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={category.id} className="hover-lift" style={{ animationDelay: `${index * 50}ms` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-4xl mb-4 block">👨‍🏫</span>
            <h2 className="text-3xl font-bold text-white mb-2">Meet Our Instructors</h2>
            <p className="text-navy-400">Learn from industry experts with real-world experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.slice(0, 6).map((instructor, index) => (
              <div key={instructor.id} className="hover-lift" style={{ animationDelay: `${index * 75}ms` }}>
                <InstructorCard instructor={instructor} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-4xl mb-4 block">✨</span>
            <h2 className="text-3xl font-bold text-white mb-2">Why Choose LearnHub?</h2>
            <p className="text-navy-400">Everything you need to succeed in your learning journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎓', title: 'Expert Instructors', desc: 'Learn from industry professionals with years of experience' },
              { icon: '📱', title: 'Learn Anywhere', desc: 'Access courses on any device, anytime, anywhere' },
              { icon: '🏆', title: 'Certificates', desc: 'Earn certificates to showcase your new skills' },
              { icon: '💡', title: 'Hands-on Projects', desc: 'Build real projects to apply what you learn' },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="card p-6 text-center hover-lift group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-navy-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
            
            <div className="relative">
              <span className="text-5xl mb-6 block">🚀</span>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to start learning?
              </h2>
              <p className="text-navy-300 mb-8 text-lg">
                Join thousands of students and start your journey to mastering new skills today.
              </p>
              <ConfettiButton href="/courses" className="btn-primary text-lg">
                🎉 Get Started Now - It's Free!
              </ConfettiButton>
              
              {/* Trust badges */}
              <div className="mt-8 flex items-center justify-center gap-6 text-navy-400 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free to start
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}