'use client'

import React, { useEffect } from 'react'
import {
  motion,
  useAnimationControls,
  type Variants,
} from 'framer-motion'

// --- Animation Variants (no changes needed) ---

const bellVariants: Variants = {
  ring: {
    rotate: [0, 25, -25, 15, -10, 5, -2, 0],
    transition: { duration: 1, ease: 'easeInOut' },
  },
}
const clapperVariants: Variants = {
  ring: {
    rotate: [0, 7, -7, 7, -7, 7, -7, 0],
    x: [0, -3, 3.5, -2.5, 2.5, -1, 0],
    transition: { duration: 1, ease: 'easeInOut', delay: 0.1 },
  },
}

const notificationPopupVariants: Variants = {
  ring: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, type: 'spring', stiffness: 400, damping: 20 },
  },
  idle: { opacity: 0, scale: 0.3 },
}

// --- Component Definition ---

type NotificationBellProps = {
  size?: number | string
  className?: string
  animateRing?: boolean
  onClick?: () => void
  /** The color of the bell, defaults to the parent's text color. */
  fill?: string
}

export const NotificationBell = ({
  size = 28,
  className = '',
  animateRing = true,
  fill = 'currentColor', // Default to inherit color from parent text
}: NotificationBellProps) => {
  const controls = useAnimationControls()

  useEffect(() => {
    if (animateRing) {
      controls.start('ring')
    }
  }, [animateRing, controls])

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" // The internal coordinate system of the SVG
      width={size}
      height={size}
      className={className}
      style={{ cursor: 'pointer', overflow: 'visible' }}
    >
      {/* Group for the clapper, animated separately */}
      <motion.g
        variants={clapperVariants}
        animate={controls}
      >
        <path fill={fill} d="M10 21h4a2 2 0 1 1-4 0z" />
      </motion.g>

      {/* Group for the main bell body, animated together */}
      <motion.g
        style={{ originY: 0 }}
        variants={bellVariants}
        animate={controls}
      >
        <path
          fill={fill}
          d="M18 16.5V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5.5l-2 2v1h16v-1l-2-2z"
        />
        <path fill={fill} d="M20 18.5a2.5 2.5 0 0 1-5 0h5z" opacity="0" />
      </motion.g>

      {/* Group for the notification badge */}
      <motion.g
        initial="idle"
        variants={notificationPopupVariants}
        animate={controls}
      >
        <circle cx="19" cy="5" r="10" fill="#FF4C12" />
        <text
          x="19"
          y="5.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="15"
          fontWeight="bold"
        >
          3
        </text>
      </motion.g>
    </motion.svg>
  )
}
