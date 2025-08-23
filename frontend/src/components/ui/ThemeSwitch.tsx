'use-client'

import { useState } from "react"
import { motion } from "framer-motion"
import LightBulb from "./lightBulb"

// --- Animation Variants ---
const frameVariants = {
  on: {
    backgroundColor: "#49494e",
    boxShadow: `inset 0.1em 0.1em 0 0.1em rgba(0, 0, 0, 0.3)`,
  },
  off: {
    backgroundColor: "#222",
    boxShadow: `inset 0.22em 0.22em 0 0.22em rgba(22, 22, 22, 0.3)`,
  },
}

const transition = { duration: 0.3, ease: "easeOut" }

// --- Component ---
const ThemeSwitch = () => {
  const [on, setOn] = useState(true)

  return (
    <button
      onClick={() => setOn(!on)}
      className="w-24 h-32 text-4xl"
      aria-label={on ? "Turn light off" : "Turn light on"}
    >
      <motion.div
        className="w-full h-full rounded-full"
        variants={frameVariants}
        animate={on ? "on" : "off"}
        transition={transition}
      >
        <LightBulb isOn={on} />
      </motion.div>
    </button>
  )
}

export default ThemeSwitch
