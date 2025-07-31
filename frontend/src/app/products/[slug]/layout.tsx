import ProductAccordion from '@/components/products/productAccordion'
import { ProductBreadCrumb } from '@/components/products/productBreadCrumb'
import RatingStars from '@/components/products/rating-stars'
import { ReactNode } from 'react'

type Props = { children: ReactNode, modal: ReactNode, productHero: ReactNode }

export default function Layout({ children, modal, productHero }: Props) {

  return <>
    {children}
    <ProductBreadCrumb />
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
      {productHero}
    </div>
    <ProductAccordion />
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
      <RatingStars value={4} />
    </div>

    {modal}
  </>
}
