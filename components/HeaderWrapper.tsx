import Header from './Header'
import { getCourses } from '@/lib/cosmic'

export default async function HeaderWrapper() {
  const courses = await getCourses()
  return <Header courses={courses} />
}