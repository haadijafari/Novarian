import ProductAccordion from '@/components/products/productAccordion'
import { ProductBreadCrumb } from '@/components/products/productBreadCrumb'
import { ReactNode } from 'react'
export default function Layout({ children, modal, productHero }: { children: ReactNode, modal: ReactNode, productHero: ReactNode }) {

  return <>
    {children}
    <ProductBreadCrumb />
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
      {productHero}
    </div>
    <ProductAccordion />
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
    </div>

    {modal}
  </>
}
