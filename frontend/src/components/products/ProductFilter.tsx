'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type Category } from '@/lib/schemas/schemas';
import Icon from '../ui/Icon';

const ProductFilter = ({ categories }: { categories: Category[] }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams(); // READ the current URL params
  const selectedCategory = searchParams.get('category') || 'all'

  const handleSelect = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);

    if (categoryName === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryName)
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <ol dir='ltr' className='bg-surface text-ink flex flex-1 gap-4'>
        {categories.map((category, i) => {
          const isSelected = selectedCategory === category.name;

          return (
            <div
              onClick={() => handleSelect(category.name)}
              key={i}
              className={`group flex items-center p-3 gap-3 rounded-full transition-colors ${isSelected
                ? "bg-surface-accent text-ink-accent cursor-default" // Use cursor-default for active item
                : "bg-surface-sharp text-ink-sharp hover:bg-surface-accent cursor-pointer"}
                `}
            >
              <Icon iconName={category.Icon} className={`${isSelected ? "fill-active-sharp" : "group-hover:fill-active-accent"}`} />
              <p>{category.name}</p>
            </div>
          );
        })}
      </ol>
    </div>
  )
}

export default ProductFilter;
