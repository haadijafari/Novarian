'use client'

import React from 'react'
import { HTMLMotionProps, motion } from 'motion/react'

interface Props extends HTMLMotionProps<'div'> {
  text: string
}

const ErrorPopUp = ({ text, ...divProps }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        // Remove 'duration' when using a spring
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      {...divProps}
    >
      {text}
    </motion.div>
  )
}

export default ErrorPopUp
