'use client'
import { useScroll, useTransform, motion, type MotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  })

  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001
  })

  return (
    <div className="relative" ref={containerRef}>
      <svg className="w-full mb-40" viewBox="0 0 250 90">
        <path fill="none" id="curve" d="m0,88.5c61.37,0,61.5-68,126.5-68,58,0,51,68,123,68" />
        <text className="text-[4px] uppercase fill-surface-accent">
          {
            [...Array(3)].map((_, i) => {
              const startOffset = useTransform(
                smoothScrollYProgress, [0, 1],
                [`${145 - (i * 45)}%`, `${100 - (i * 45)}%`]
              )

              return (
                <motion.textPath
                  key={i}
                  direction="rtl"
                  startOffset={startOffset}
                  href="#curve">
                  همانطور که هر هدیه داستانی دارد، ما راوی داستان کسب‌وکار شما خواهیم بود.
                </motion.textPath>
              )
            })
          }
        </text>
      </svg>
      <StaticLists scrollProgress={scrollYProgress} />
    </div>
  )
}

const StaticLists = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const y = useTransform(scrollProgress, [0, 1], [-225, 0])

  return (
    <div className="h-[250px] bg-surface-muted overflow-hidden">
      <motion.div style={{ y }} className="h-full flex justify-center items-center p-10">
        <ol className="flex justify-center text-ink">
          place holder for footers footer
        </ol>
      </motion.div>
    </div>
  )
}

export default Footer
