'use client'

import {
  useAnimate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function OrderButton() {
  const [scope, animate] = useAnimate()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 1. Create a MotionValue to track the gift's y-position
  const y = useMotionValue(0)

  // 2. State to hold the calculated y-range for the animation
  // We calculate this in useEffect once the components have rendered
  const [yRange, setYRange] = useState([0, 0])

  // 3. Create a transform to map the y-position to a clipPath value
  // As 'y' changes between the values in 'yRange', 'clipPath' will
  // interpolate between its start and end values.
  // 'clamp: true' ensures the clipPath value doesn't go beyond its defined range.
  const clipPath = useTransform(
    y,
    yRange,
    ['inset(0 0 0% 0)', 'inset(0 0 100% 0)'],
    { clamp: true }
  )

  useEffect(() => {
    // This function calculates the precise start and end points for the animation
    const calculateRange = () => {
      const buttonEl = buttonRef.current
      // We use scope.current to reliably select the gift group div
      const giftGroupEl = scope.current.querySelector('#giftGroup')

      if (!buttonEl || !giftGroupEl) return

      const buttonRect = buttonEl.getBoundingClientRect()
      const giftRect = giftGroupEl.getBoundingClientRect()

      // The animation should start when the gift's bottom aligns with the button's top
      const yStart = -(giftRect.height / 2 + buttonRect.height / 2)

      // The animation should end when the gift's top aligns with the button's top
      const yEnd = giftRect.height / 2 - buttonRect.height / 2

      setYRange([yStart, yEnd])
    }

    calculateRange()

    const animateGift = async () => {
      y.set(0)
      scope.current.querySelector('#giftGroup')!.style.zIndex = '0'

      // Animate up
      await animate(y, -300, { duration: 1 })

      // Bring gift to the front
      scope.current.querySelector('#giftGroup')!.style.zIndex = '20'

      // Animate down, passing through the button. The `useTransform` hook
      // will automatically handle the clipPath animation during this movement.
      await animate(y, 0, { duration: 1, ease: 'linear' })
    }

    animateGift()

    window.addEventListener('resize', calculateRange)
    return () => window.removeEventListener('resize', calculateRange)

  }, [])

  return (
    <div
      ref={scope}
      className="relative flex justify-center items-center h-screen w-screen overflow-hidden"
    >
      {/* Button */}
      <button
        className="relative z-10 grid h-32 w-64 place-items-center rounded-3xl border-2 border-violet-400 bg-white text-black"
        id="button"
        ref={buttonRef}
      >
        Order Now
      </button>

      {/* Gift Group - now a motion.div linked to the 'y' MotionValue */}
      <motion.div
        id="giftGroup"
        className="pointer-events-none absolute grid h-20 w-64 place-items-center"
        style={{ y }} // Link the div's position to our MotionValue
      >
        {/* Pink background box */}
        <div className="col-start-1 row-start-1 h-20 w-20 rounded-lg bg-pink-400" />

        {/* Violet front box */}
        <motion.div
          id="frontGiftBox"
          className="col-start-1 row-start-1 h-20 w-20 rounded-lg bg-violet-400"
          style={{ clipPath }} // Link the clipPath to our transformed MotionValue
        />
      </motion.div>
    </div>
  )
}

export default OrderButton
