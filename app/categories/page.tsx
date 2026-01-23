import { getCategories } from '@/lib/cosmic'
import CategoryCard from '@/components/CategoryCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories - LearnHub',
  description: 'Browse courses by category. Find the perfect learning path for your goals.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Browse by Category</h1>
          <p className="text-xl text-navy-300 max-w-2xl mx-auto">
            Find the perfect course for your learning goals by exploring our categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} size="large" />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-navy-400 text-lg">No categories available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}