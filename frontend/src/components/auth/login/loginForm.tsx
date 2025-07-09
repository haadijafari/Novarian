'use client'

import React, { useState } from 'react'
import { UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import ErrorPopUp from '@/components/ui/ErrorPopUp'
import SubmitButton from '@/components/ui/SubmitButton'
import { loginSubmit } from '@/actions/auth/loginActions'
import InputWithIcon from '@/components/ui/inputWithIcon'

const LoginForm = () => {
  const [error, setError] = useState("")
  const [isPending, setIspending] = useState(false)
  const router = useRouter()

  return (
    <form
      noValidate
      className="flex justify-center m-auto aspect-square overflow-hidden flex-col items-center w-full max-w-[500px] mx-auto rounded-lg p-6 sm:p-10 space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setError("")

        const formData = new FormData(e.currentTarget)
        const numberOrGmail = formData.get('numberOrGmail') as string;

        if (!numberOrGmail || numberOrGmail.trim() === '') {
          setError("لطفا این فیلد را پر کنید") // Your custom error message
          return // Stop the submission process
        }

        setIspending(true)

        const result = await loginSubmit(formData)

        setIspending(false)

        if (result.error) {
          setError(result.error)
        }
        else {
          // Make sure to pass the phone number in the query
          router.push(`/auth?state=otp&number=${encodeURIComponent(numberOrGmail)}`)
        }
      }}
    >
      <h1 className="text-[clamp(2rem,11.5vw,3.6rem)] sm:text-[clamp(2rem,4.5vw,3.6rem)] font-semibold text-center mb-8 sm:mb-16">عضویت یا ورود</h1>

      <InputWithIcon
        className="h-16 sm:h-20 w-full bg-primary-100 dark:bg-primary-900 dark:border-primary-100 border-primary-900 rounded-full border-2 outline-none text-xl sm:text-2xl font-medium pr-7 pl-11 p-3"
        labelClassName='text-md text-bold'
        id="numberOrGmail-input"
        name="numberOrGmail"
        persian
        type="text"
        placeholder="شماره تلفن یا ‍‍ایمیل"
        required
        iconSize="26"
        IconComponent={UserRound}
      />

      {/* Only render the error popup if there is an error */}
      <AnimatePresence>
        {error && (
          <ErrorPopUp
            text={error}
            className="text-secondary-500 rounded-xl text-sm sm:text-base"
          />
        )}
      </AnimatePresence>

      <SubmitButton
        className="w-full h-16 items-center text-3xl sm:h-20 rounded-full shadow-xl font-semibold transition-colors duration-200 bg-accent-500 dark:bg-accent-400 dark:text-primary-50 text-primary-950 dark:hover:bg-accent-600 hover:bg-accent-300"
        pending={isPending}
        pendingClassName="dark:bg-accent-200 bg-accent-700 text-gray-700 dark:text-gray-700 cursor-not-allowed flex items-center justify-center space-x-2"
        pendingText="در حال ارسال..."
      >
        ورود
      </SubmitButton>
    </form>
  )
}

export default LoginForm
