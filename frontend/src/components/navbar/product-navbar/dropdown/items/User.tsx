import Dropdown from '../Dropdown'
import Image from 'next/image'

const UserDropdown = () => {
  return (
    <Dropdown
      button={
        <Image
          width="2"
          height="20"
          className="h-10 w-10 rounded-full"
          src={"/public/img/avatars/avatar4.png"}
          alt="ALT"
        />
      }
      classNames={'py-2 top-8 -left-[180px] w-max'}
    >
      <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
        <div className="ml-4 mt-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              👋 سلام، علی
            </p>{' '}
          </div>
        </div>
        <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

        <div className="ml-4 mt-3 flex flex-col">
          <a
            href=" "
            className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
          >
            تنظیمات پروفایل
          </a>
          <a
            href=" "
            className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
          >
            خروج از حساب
          </a>
        </div>
      </div>
    </Dropdown>
  )
}

export default UserDropdown
