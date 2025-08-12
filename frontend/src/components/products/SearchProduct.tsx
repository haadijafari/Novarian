import { Search } from 'lucide-react';

const NavbarSearch = () => {
  return (
    <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
      <p className="pl-3 pr-2 text-xl">
        <Search className="h-4 w-4 text-gray-400 dark:text-white" />
      </p>
      <input
        type="text"
        placeholder="جستجو..."
        className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
      />
    </div>
  );
};

export default NavbarSearch;
