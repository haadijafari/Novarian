import React from 'react'
import OtpForm from './components/OtpPage'
import LoginForm from './components/loginForm'
import * as motion from 'motion/react-client'
import { AnimatePresence } from 'motion/react'


type homePageProps = {
  state: "login" | "otp"
  number: string
}
// app/login/page.tsx
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<homePageProps>
}) {
  const { state, number } = await searchParams

  const isLogin = state !== "otp"

  return (
    <div className='flex relative w-dvw h-dvh  bg-primary-50 dark:bg-primary-950 text-primary-950 dark:text-primary-50'>
      <div
        className={`absolute w-full h-full`}
      >
        <motion.div
          initial={{
            x: isLogin ? "var(--x-login, 0)" : "var(--x-otp, 0)",
            y: isLogin ? "var(--y-login, 0)" : "var(--y-otp, 0)",
          }}
          animate={{
            x: isLogin ? "var(--x-login, 0)" : "var(--x-otp, 0)",
            y: isLogin ? "var(--y-login, 0)" : "var(--y-otp, 0)",
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute dark:bg-secondary-600 bg-secondary-600 z-10 left-0 top-[-280%] w-full h-[300%] sm:w-[300%] sm:top-0 sm:h-full rounded-[9.5em] sm:left-[-250%] sm:[--x-otp:100%] sm:[--x-login:0] max-sm:[--y-otp:120%] max-sm:[--y-login:0]" />
      </div>

      <AnimatePresence initial={false}>
        {isLogin ? (
          <motion.div
            key="login"
            initial={{
              x: "var(--x-initial, 0)",
              y: "var(--y-initial, 0)",
            }}
            animate={{
              x: "var(--x-animate, 0)",
              y: "var(--y-animate, 0)",
              transition: { delay: 0.6, duration: 0.6, ease: "easeInOut" },
            }}
            exit={{
              x: "var(--x-initial, 0)",
              y: "var(--y-initial, 0)",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className='overflow-auto flex absolute right-0 w-full sm:w-[50%] h-full justify-center md:[--x-initial:100%] md:[--x-animate:0] max-sm:[--y-initial:60%] max-sm:[--y-animate:0]'>
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{
              x: "var(--x-initial, 0)",
              y: "var(--y-initial, 0)",
            }}
            animate={{
              x: "var(--x-animate, 0)",
              y: "var(--y-animate, 0)",
              transition: { delay: 0.6, duration: 0.6, ease: "easeInOut" },
            }}
            exit={{
              x: "var(--x-initial, 0)",
              y: "var(--y-initial, 0)",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className='top-0 overflow-auto flex absolute left-0 w-dvw sm:w-[50%] sm:h-[100%] h-[80%] justify-center md:[--x-initial:-100%] md:[--x-animate:0] max-sm:[--y-initial:-60%] max-sm:[--y-animate:0]'>
            <OtpForm phoneNumber={number} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
