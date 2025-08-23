'use-client'

import { motion } from "framer-motion"

const bulbColorVariants = {
  on: { fill: "#ffee78" },
  off: { fill: "#d7d7d7" },
}

const curveColorVariants = {
  on: { fill: "#ffee78" },
  off: { fill: "#d8d8d8" },
}

const transition = { duration: 0.3, ease: "easeOut" }

interface LightBulbProps {
  isOn: boolean;
}

const LightBulb = ({ isOn }: LightBulbProps) => {
  // Define dimensions for the screw base for easy calculation
  const screwBase = { x: 9, y: 8, width: 6, height: 6.5 };
  const stripeHeight = screwBase.height / 4;

  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      initial={false}
      animate={isOn ? "on" : "off"}
    >
      <defs>
        <clipPath id="screwShadowClip">
          <rect
            x={screwBase.x}
            y={screwBase.y}
            width={screwBase.width / 2}
            height={screwBase.height}
          />
        </clipPath>
      </defs>

      {/* Group is translated up to fit the screw base inside the viewbox */}
      <g transform="translate(0, -8)">
        {/* Main glass bulb */}
        <motion.circle
          cx="12"
          cy="25"
          r="8"
          variants={bulbColorVariants}
          transition={transition}
        />

        {/* Bulb neck/curve */}
        <motion.path
          d="M 9 14.5 L 15 14.5 L 18.92 21 L 5.08 21 Z"
          variants={curveColorVariants}
          transition={transition}
        />

        {/* Top metal contact */}
        <path
          d="M 10.5 8 L 13.5 8 A 1.5 1.5 0 0 0 10.5 8 Z"
          fill="#888"
        />

        {/* --- Screw Base --- */}
        <rect x={screwBase.x} y={screwBase.y + (stripeHeight * 0)} width={screwBase.width} height={stripeHeight} fill="#bbb" />
        <rect x={screwBase.x} y={screwBase.y + (stripeHeight * 1)} width={screwBase.width} height={stripeHeight} fill="#999" />
        <rect x={screwBase.x} y={screwBase.y + (stripeHeight * 2)} width={screwBase.width} height={stripeHeight} fill="#bbb" />
        <rect x={screwBase.x} y={screwBase.y + (stripeHeight * 3)} width={screwBase.width} height={stripeHeight} fill="#999" />
        <rect
          x={screwBase.x}
          y={screwBase.y}
          width={screwBase.width}
          height={screwBase.height}
          fill="rgba(0,0,0,0.15)"
          clipPath="url(#screwShadowClip)"
        />
      </g>
    </motion.svg>
  )
}

export default LightBulb
