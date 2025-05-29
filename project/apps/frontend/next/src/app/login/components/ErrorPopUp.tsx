'use client'

import React from 'react'
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react'


interface Props
  extends HTMLMotionProps<'div'> {
  text: string
}

const ErrorPopUp = ({
  text,
  ...divProps
}: Props) => {
  return (<>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        {...divProps}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  </>
  )
}

export default ErrorPopUp
