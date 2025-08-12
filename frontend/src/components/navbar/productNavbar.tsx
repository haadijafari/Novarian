import NavbarBrand from '../ui/NavbarBrand';
import SearchProduct from '../products/SearchProduct';
import ShoppingCartDropdown from '../ui/ShoppingCartDropdown';
import UserDropdown from '../ui/UserDropdown';
import DarkModeToggle from '../ui/DarkModeToggle';
import NotificationsDropdown from '../ui/NotificationsDropdown';

type Props = {
  brandText: string;
}

const Navbar = ({ brandText }: Props) => {
  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <NavbarBrand brandText={brandText} />

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <SearchProduct />
        <NotificationsDropdown />
        <ShoppingCartDropdown />
        <DarkModeToggle />
        <UserDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
