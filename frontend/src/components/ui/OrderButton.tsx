'use client'

import { motion, useAnimate } from 'framer-motion'
import { useEffect } from 'react'

export default function BoxOverButton() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const animateGift = async () => {
      await animate("#giftGroup", { y: "-150%" }, { duration: 0.5 })

      // change z index with ref
      scope.current.querySelector("#giftGroup")!.style.zIndex = "20"

      // Move back down on top of button
      await animate("#giftGroup", { y: "0%" }, { duration: 0.5 })
    }
    animateGift()
  }, [])

  return (
    <div
      ref={scope}
      className="relative flex justify-center items-center h-screen w-screen">
      {/* Button */}
      <div
        className="relative col-start-1 row-start-1 grid h-32 w-64 place-items-center rounded-3xl border-2 border-violet-400 bg-white text-black"
        style={{ zIndex: 10 }}
      >
        Order Now
      </div>
      <div
        id='giftGroup'
        className="pointer-events-none absolute grid h-32 w-64 place-items-center"
        style={{ zIndex: 0 }}
      >
        <div className="col-start-1 row-start-1 h-20 w-20 rounded-lg bg-pink-400" />
        <div
          id='frontGiftBox'
          className="col-start-1 row-start-1 h-20 w-20"
        >
          <div className="h-full w-full rounded-lg bg-violet-400" />
        </div>
      </div>
    </div>
  )
}
