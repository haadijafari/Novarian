import { ReactNode } from 'react'
export default function Layout({ children, modal, productHero }: { children: ReactNode, modal: ReactNode, productHero: ReactNode }) {

  return <>
    {children}
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
      {productHero}
    </div>
    <div className='flex items-center justify-center min-h-screen w-screen bg-fuchsia-600 p-4'>
    </div>

    {modal}
  </>
}
