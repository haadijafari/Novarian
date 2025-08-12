import Link from 'next/link';

type Props = {
  brandText: string;
}

const NavbarBrand = ({ brandText }: Props) => {
  return (
    <div className="ml-[6px]">
      <div className="h-6 w-[224px] pt-1">
        <a
          className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
          href=" "
        >
          صفحات
          <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
            {' '}
            /{' '}
          </span>
        </a>
        <Link
          className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
          href="#"
        >
          {brandText}
        </Link>
      </div>
      <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
        <Link
          href="#"
          className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
        >
          عنوان
        </Link>
      </p>
    </div>
  );
};

export default NavbarBrand;
