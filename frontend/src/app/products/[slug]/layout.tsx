import ProductAccordion from '@/components/products/productAccordion'
import { ProductBreadCrumb } from '@/components/products/productBreadCrumb'
import { ReactNode } from 'react'

type Props = { children: ReactNode, modals: ReactNode, productHero: ReactNode, reviewSection: React.ReactNode, productSuggestion: ReactNode }

export default function Layout({ children, modals, productHero, reviewSection, productSuggestion }: Props) {

  return <>
    {children}
    <ProductBreadCrumb />
    <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
      {productHero}
    </div>
    <ProductAccordion />
    <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
      {reviewSection}
    </div>
    <div className='flex items-center justify-center min-h-screen w-screen bg-surface p-4'>
      {productSuggestion}
    </div>


    {modals}
  </>
}
