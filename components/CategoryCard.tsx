import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  size?: 'default' | 'large'
}

export default function CategoryCard({ category, size = 'default' }: CategoryCardProps) {
  const { metadata } = category

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`card group block text-center ${
        size === 'large' ? 'p-8' : 'p-6'
      }`}
    >
      <div className={`mb-4 ${size === 'large' ? 'text-6xl' : 'text-4xl'}`}>
        {metadata?.icon || '📂'}
      </div>
      <h3 className={`font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors ${
        size === 'large' ? 'text-xl' : 'text-lg'
      }`}>
        {metadata?.name || category.title}
      </h3>
      {metadata?.description && (
        <p className={`text-navy-400 ${size === 'large' ? 'text-base' : 'text-sm'} line-clamp-2`}>
          {metadata.description}
        </p>
      )}
    </Link>
  )
}