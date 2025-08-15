import Dropdown from '../ui/Dropdown';
import { Gift, HeartHandshake } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

const NotificationsDropdown = () => {
  return (
    <Dropdown
      button={
        <p className="cursor-pointer">
          <NotificationBell className="h-4 w-4 text-gray-600 dark:text-white" />
        </p>
      }
      animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
      classNames={'py-2 top-4 -left-[230px] md:-left-[440px] w-max'}
    >
      <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            خوانده شد
          </p>
          <p className="text-base font-bold text-navy-700 dark:text-white">
            اعلان ها
          </p>
        </div>

        <button className="flex w-full items-center">
          <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white bg-red-200">
            <Gift />
          </div>
          <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
            <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
              هدیه‌های روز معلم و ولنتاین رسید!
            </p>
            <p className="font-base text-left text-xs text-gray-900 dark:text-white">
              از تخفیف‌های ویژه ما برای این مناسبت‌ها بهره‌مند شوید!
            </p>
          </div>
        </button>

        <button className="flex w-full items-center">
          <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white bg-red-200 ">
            <HeartHandshake />
          </div>
          <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
            <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
              هدیه‌های روز معلم و ولنتاین رسید!
            </p>
            <p className="font-base text-left text-xs text-gray-900 dark:text-white">
              از تخفیف‌های ویژه ما برای این مناسبت‌ها بهره‌مند شوید!
            </p>
          </div>
        </button>
      </div>
    </Dropdown>
  );
};

export default NotificationsDropdown;
