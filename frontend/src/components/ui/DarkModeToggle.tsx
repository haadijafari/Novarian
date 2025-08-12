'use client'

import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  const [darkmode, setDarkmode] = useState(true);

  const toggleDarkMode = () => {
    if (darkmode) {
      document.body.classList.remove('dark');
      setDarkmode(false);
    } else {
      document.body.classList.add('dark');
      setDarkmode(true);
    }
  };

  return (
    <div
      className="cursor-pointer text-gray-600"
      onClick={toggleDarkMode}
    >
      {darkmode ? (
        <Sun className="h-4 w-4 text-gray-600 dark:text-white" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600 dark:text-white" />
      )}
    </div>
  );
};

export default DarkModeToggle;

