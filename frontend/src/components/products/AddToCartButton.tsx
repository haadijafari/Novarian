'use client'

import { motion } from 'motion/react'
import React, { useState } from 'react'

const AddToCartButton = () => {
  const [added, isAdded] = useState(true)
  console.log(added)
  return (
    <motion.button
      className={`
        ${added ? "bg-primary-900" : "bg-accent-300"}
        p-2 rounded-4xl
      `}
      onClick={() => { isAdded(!added) }}
    >added to cart</motion.button>
  )
}

export default AddToCartButton
