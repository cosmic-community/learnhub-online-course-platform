import { getCourses, getCategories, getInstructors } from '@/lib/cosmic'
import Header from './Header'

export default async function HeaderWrapper() {
  // Fetch data for the command palette
  const [courses, categories, instructors] = await Promise.all([
    getCourses(),
    getCategories(),
    getInstructors()
  ])

  return (
    <Header 
      courses={courses}
      categories={categories}
      instructors={instructors}
    />
  )
}