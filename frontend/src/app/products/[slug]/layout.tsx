import Navbar from '@/components/navbar/productNavbar' // Updated import path
import ProductAccordion from '@/components/products/productAccordion'
import { ProductBreadCrumb } from '@/components/products/productBreadCrumb'
import { ReactNode } from 'react'

type Props = { children: ReactNode, modals: ReactNode, productHero: ReactNode, reviews: React.ReactNode, suggestions: ReactNode, discussions: ReactNode }

export default function Layout({ children, modals, productHero, reviews, suggestions, discussions }: Props) {

  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto dark:bg-navy-900">
      <Navbar
        brandText={"اسم-محصول"}
      />
      <div className="mx-2.5 flex-none transition-all md:pr-2 xl:ml-[323px]">
        {children}
        <ProductBreadCrumb />
        <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
          {productHero}
        </div>
        <ProductAccordion />
        <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
          {reviews}
        </div>
        <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
          {suggestions}
        </div>
        <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
          {discussions}
        </div>
      </div>
      {modals}
    </div>
  );
}
