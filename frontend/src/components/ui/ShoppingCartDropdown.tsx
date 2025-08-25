import { ShoppingCart } from 'lucide-react';
import Dropdown from '../ui/Dropdown';

const ShoppingCartDropdown = () => {
  return (
    <Dropdown
      button={
        <p className="cursor-pointer">
          <ShoppingCart className="h-4 w-4 text-gray-600 fill-white" />
        </p>
      }
      classNames={'py-2 top-8 -left-[180px] w-max'}
    >
      <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
        در اینده نزدیک
      </div>
    </Dropdown>
  );
};

export default ShoppingCartDropdown;

