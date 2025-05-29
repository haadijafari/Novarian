'use client'

import React, { useActionState } from 'react'
import { UserRound } from 'lucide-react'
import ErrorPopUp from './ErrorPopUp'
import { loginSubmit } from './actions'
import SubmitButton from './SubmitButton'
import { useRouter } from 'next/navigation'
import InputWithIcon from './inputWithIcon'

const initialState = {
  error: '',
}

const LoginForm = () => {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(loginSubmit, initialState)

  return (
    <form
      className="flex flex-col justify-between items-center w-full max-w-md mx-auto rounded-lg p-6 sm:p-10 space-y-6"
      action={formAction}
    >
      <h1 className="text-5xl sm:text-8xl font-semibold text-center mb-16">Login</h1>

      <InputWithIcon
        className="h-16 sm:h-20 w-full bg-white text-black rounded-full border-2 outline-none text-xl sm:text-2xl font-medium pr-11 pl-7 p-3"
        id="numberOrGmail-input"
        name="numberOrGmail"
        type="text"
        placeholder="Number or Gmail"
        required
        iconSize="26"
        IconComponent={UserRound}
      />

      <ErrorPopUp
        text={state.error}
        className="text-red-500 rounded-xl text-sm sm:text-base"
      />

      <SubmitButton
        onClick={(e) => {
          e.preventDefault()
          router.push("/login?state=otp")
        }}
        className="w-full h-16 sm:h-20 rounded-full shadow-xl font-semibold transition-colors duration-200 bg-red-300 text-black hover:bg-red-400"
        pending={isPending}
        pendingClassName="bg-red-200 text-gray-500 cursor-not-allowed flex items-center justify-center space-x-2"
        pendingText="Logging in…"
      >
        login
      </SubmitButton>
    </form>
  )
}

export default LoginForm
