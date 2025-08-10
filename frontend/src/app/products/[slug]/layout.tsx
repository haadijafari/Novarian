import ProductAccordion from '@/components/products/productAccordion'
import { ProductBreadCrumb } from '@/components/products/productBreadCrumb'
import { ReactNode } from 'react'

type Props = { children: ReactNode, lightBox: ReactNode, productHero: ReactNode, reviewSection: React.ReactNode }

export default function Layout({ children, lightBox, productHero, reviewSection }: Props) {

  return <>
    {children}
    <ProductBreadCrumb />
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
      {productHero}
    </div>
    <ProductAccordion />
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
      {reviewSection}
    </div>

    {lightBox}
  </>
}
