import { ProductBreadCrumb } from '@/components/products'
import Link from 'next/link'

type Props = {
  brandText: string
}

const NavbarBrand = ({ brandText }: Props) => {
  return (
    <div className="ml-[6px]">
      <div className="h-6 w-[224px] pt-1">
        <ProductBreadCrumb />
      </div>
      <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
        <Link
          href="#"
          className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
        >
          {brandText}
        </Link>
      </p>
    </div>
  )
}

export default NavbarBrand
