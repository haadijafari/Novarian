'use client'

import React, {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  errorMessageVariants,
  loadingVariants,
  shakeVariants
} from './otpVariants'
import { AnimatePresence, motion } from 'framer-motion'
import SubmitButton from './SubmitButton'

type Props = {
  length: number
  submitForm: (arg1: string) => Promise<{ error: string }>
}

const OtpInput = ({ length, submitForm: onOtpSubmit }: Props) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focuses the first input field on component mount.
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Memoizes the OTP submission logic.
  const submitOtp = useCallback(
    async (combinedOtp: string) => {
      setIsPending(true)
      const { error: submitError } = await onOtpSubmit(combinedOtp)
      setOtp(new Array(length).fill(''))
      setError(submitError)
      setIsPending(false)

      // using the setTimeout to send the focus call to the end of js event loop
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 1)
    },
    [onOtpSubmit, inputRefs]
  )

  // Handles input changes and manages focus.
  const handleChange = useCallback(
    async (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const newOtp = [...otp]

      // Return if the value is not number
      if (isNaN(+value)) return

      // removing the error state
      setError('')

      // allows only one number
      newOtp[index] = value.substring(value.length - 1)
      setOtp(newOtp)

      // moving to next input
      if (value && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }

      // Submits OTP if all fields are filled.
      const combinedOtp = newOtp.join('')
      if (
        combinedOtp.length === length &&
        index === length - 1 &&
        !newOtp.some(char => char === '')
      ) {
        await submitOtp(combinedOtp)
      }
    },
    [otp, length, submitOtp]
  )

  // Handles keyboard events like Backspace and Arrow keys for navigation.
  const handleKeyDown = useCallback(
    async (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus()
          const newOtp = [...otp]
          newOtp[index - 1] = ''
          setOtp(newOtp)
        } else if (otp[index] && index >= 0) {
          const newOtp = [...otp]
          newOtp[index] = ''
          setOtp(newOtp)
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      } else if (e.key === 'Enter') {
        const combinedOtp = otp.join('')
        if (combinedOtp.length === length && !otp.some(char => char === '')) {
          await submitOtp(combinedOtp)
        } else {
          setError('please enter the full code')
        }
      }
    },
    [otp, length]
  )

  // Clears the clicked input field and sets focus.
  const handleClick = useCallback(
    (index: number) => {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      inputRefs.current[index]?.focus()
    },
    [otp]
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const value = e.clipboardData.getData('text').trim()
      setError('')

      const firstNonDigit = value.search(/\D/)
      const leadingNum = firstNonDigit === -1 ? value.length : firstNonDigit
      const newOtp = [...otp]

      for (let i = 0; i < length; i++) {
        const c = value[i]
        if (leadingNum - 1 < i) {
          newOtp[i] = ''
        } else if (isNaN(+c)) {
          break
        } else {
          newOtp[i] = c
        }
      }

      const focusIndex = Math.min(leadingNum, length - 1)
      inputRefs.current[focusIndex]?.focus()
      setOtp(newOtp)

      const combinedOtp = newOtp.join('')
      if (combinedOtp.length === length && !newOtp.some(char => char === '')) {
        await submitOtp(combinedOtp)
      }
    },
    [otp, length, submitOtp]
  )

  return (
    <form
      className="flex flex-col items-center w-full max-w-md mx-auto p-6 sm:p-10 space-y-6"
    >
      <motion.div
        className="grid w-full gap-[clamp(0.75rem,2.0vw,3.5rem)]"
        style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
        variants={shakeVariants}
        initial="initial"
        animate={error ? 'shake' : 'initial'}
      >
        {otp.map((value, id) => (
          <motion.div
            variants={loadingVariants}
            animate={isPending ? 'pulse' : 'idle'}
            className="relative aspect-square w-[clamp(3rem,5vw,9rem)] text-[clamp(2rem,4vw,8rem)] bg-white text-black rounded-xl text-center border-2 border-gray-300"
            onClick={() => handleClick(id)}
            key={id}
          >
            <motion.input
              ref={el => {
                inputRefs.current[id] = el
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value}
              onPaste={e => handlePaste(e)}
              onChange={e => handleChange(id, e)}
              onKeyDown={e => handleKeyDown(id, e)}
              className="absolute inset-0 w-full h-full rounded-xl text-white cursor-pointer"
              disabled={isPending}
              aria-label={`OTP digit ${id + 1} of ${length}`}
              autoComplete="one-time-code"
            />
            <AnimatePresence>
              {value !== '' && (
                <motion.p
                  key={value + id}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.2, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 20
                  }}
                  className={`
                flex items-center justify-center aspect-square absolute inset-0 w-full h-full
                bg-white text-black rounded-xl text-center
                ${error ? 'border-red-500' : 'border-gray-300'}
                ${isPending ? 'cursor-not-allowed' : ''}
              `}
                >
                  {value}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {error && (
          <motion.p
            variants={errorMessageVariants}
            initial="hidden"
            animate="visible"
            className="col-span-full text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      <SubmitButton
        onClick={async e => {
          e.preventDefault()
          const combinedOtp = otp.join('')
          if (combinedOtp.length === length && !otp.some(char => char === '')) {
            await submitOtp(combinedOtp)
          } else {
            setError('please enter the full code')
          }
        }}
        className="w-full h-16 sm:h-20 rounded-full shadow-xl font-semibold transition-colors duration-200 bg-red-300 text-black hover:bg-red-400 mt-6"
        pending={isPending}
        pendingClassName="bg-red-200 text-gray-500 cursor-not-allowed flex items-center justify-center space-x-2"
        pendingText="submitting…"
      >
        submit
      </SubmitButton>
    </form>

  )
}

export default OtpInput
