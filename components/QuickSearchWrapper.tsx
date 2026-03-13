import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import QuickSearch from './QuickSearch'

export default async function QuickSearchWrapper() {
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors(),
  ])

  return (
    <QuickSearch 
      courses={courses} 
      categories={categories} 
      instructors={instructors} 
    />
  )
}