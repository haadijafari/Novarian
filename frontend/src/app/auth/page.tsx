import React from 'react'
import OtpPage from '@/components/auth/otp/OtpPage'
import LoginForm from '@/components/auth/login/loginForm'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import { capsuleVariants, formVarants } from './page.variants'

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
    <div className='flex relative w-dvw h-dvh bg-surface text-ink'>
      <div
        className={`absolute w-full h-full`}
      >
        <motion.div
          variants={capsuleVariants}
          animate={isLogin ? "login" : "otp"}
          className="absolute bg-surface-accent z-10 left-0 top-[-280%] w-full h-[300%] sm:w-[300%] sm:top-0 sm:h-full rounded-[9.5em] sm:left-[-250%] sm:[--x-otp:100%] sm:[--x-login:0] max-sm:[--y-otp:120%] max-sm:[--y-login:0]" />
      </div>

      <AnimatePresence mode='wait' initial={false}>
        {isLogin ? (
          <motion.div
            key="login"
            variants={formVarants}
            initial="initial"
            animate="animate"
            exit="exit"
            className='overflow-auto flex absolute right-0 w-full sm:w-[50%] h-full justify-center md:[--x-initial:100%] max-sm:[--y-initial:60%] max-sm:[--y-animate:0]'>
            <LoginForm />
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            variants={formVarants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className='top-0 overflow-auto flex absolute left-0 w-dvw sm:w-[50%] sm:h-[100%] h-[80%] justify-center md:[--x-initial:-100%] max-sm:[--y-initial:-60%] max-sm:[--y-animate:0]'>
            <OtpPage phoneNumber={number} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
