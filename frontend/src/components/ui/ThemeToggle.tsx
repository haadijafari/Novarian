'use client'

import { useState } from "react"
import { useTheme } from "next-themes"
import { circularThemeSwitch } from "@/transitions/circularThemeSwitch"
import { Lightbulb } from "lucide-react"

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme()
  const [on, setOn] = useState(false)

  const handleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOn(!on)
    const newTheme = theme === "dark" ? "light" : "dark";

    // Fallback for browsers that don't support the View Transitions API.
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    // Get the click coordinates.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Start the transition.
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    // Animate the transition
    transition.ready.then(() => {
      circularThemeSwitch(x, y)
    });
  };

  return (
    <button
      onClick={handleTheme}
      className={className ? className : "rounded-full text-sm mb-0.5"}
      aria-label={on ? "Turn light off" : "Turn light on"}
    >
      <p className="cursor-pointer">
        <Lightbulb className="h-4 w-4 rotate-180 translate-y-[1.5px] text-gray-600 fill-gray-600 dark:fill-white " />
      </p>
    </button>
  )
}

export default ThemeToggle 
