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
  loadingVariants,
  popupVariants,
  shakeVariants
} from './otp.variants'
import { AnimatePresence, motion } from 'motion/react'
import { isNumeric, toPersian } from '@/lib/utils'
import ErrorPopUp from '@/components/ui/ErrorPopUp'
import SubmitButton from '@/components/ui/SubmitButton'

type Props = {
  length: number
  submitForm: (arg1: string) => Promise<{ error: string }>
}

const OtpForm = ({ length, submitForm: onOtpSubmit }: Props) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const submitOtp = useCallback(
    async (combinedOtp: string) => {
      setIsPending(true)
      const { error: submitError } = await onOtpSubmit(combinedOtp)
      setOtp(new Array(length).fill(''))
      setError(submitError)
      setIsPending(false)

      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 1)
    },
    [onOtpSubmit, length]
  )

  const handleChange = useCallback(
    async (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setError('')

      const lastChar = value.substring(value.length - 1)

      // Only proceed if the character is a numeral (English or Persian)
      if (!isNumeric(lastChar) && lastChar !== '') return

      const newOtp = [...otp]

      // Convert to Persian before setting state to ensure display consistency
      newOtp[index] = toPersian(lastChar)
      setOtp(newOtp)

      if (lastChar && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }

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

  const handleKeyDown = useCallback(
    async (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus()
        }
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const combinedOtp = otp.join('')
        if (combinedOtp.length === length && !otp.some(char => char === '')) {
          await submitOtp(combinedOtp)
        } else {
          setError('لطفا کد را کامل وارد کنید')
        }
      }
    },
    [otp, length, submitOtp]
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const value = e.clipboardData.getData('text').trim()
      setError('')

      const sanitizedValue = value.split('').filter(isNumeric)
      if (sanitizedValue.length === 0) return

      const newOtp = [...otp]
      for (let i = 0; i < length; i++) {
        // Convert each character to Persian as it's being set
        newOtp[i] = sanitizedValue[i] ? toPersian(sanitizedValue[i]) : ''
      }

      const focusIndex = Math.min(sanitizedValue.length, length - 1)
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
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 sm:p-10 space-y-6">
      <motion.div
        dir='ltr'
        className="grid w-full justify-center gap-[clamp(1rem,1.5vw,3.0rem)]"
        style={{ gridTemplateColumns: `repeat(${length}, auto)` }}
        variants={shakeVariants}
        initial="initial"
        animate={error ? 'shake' : 'initial'}
      >
        {otp.map((value, id) => (
          <motion.div
            variants={loadingVariants}
            animate={isPending ? 'pulse' : 'idle'}
            className="relative aspect-square w-[clamp(4rem,4vw,4.5rem)] text-[clamp(2rem,4vw,4rem)] bg-primary-100 dark:bg-primary-900 rounded-xl text-center border-2"
            onClick={() => inputRefs.current[id]?.focus()}
            key={id}
          >
            <input
              ref={el => {
                inputRefs.current[id] = el
              }}
              type="tel" // "tel" is better for numeric inputs
              inputMode="numeric"
              value={value}
              onPaste={e => handlePaste(e)}
              onChange={e => handleChange(id, e)}
              onKeyDown={e => handleKeyDown(id, e)}
              className="absolute inset-0 w-full h-full rounded-xl cursor-pointer bg-transparent text-transparent caret-transparent text-center"
              disabled={isPending}
              aria-label={`رقم ${id + 1} از ${length}`}
              autoComplete="one-time-code"
              maxLength={1}
            />
            <AnimatePresence>
              {value !== '' && (
                <motion.p
                  variants={popupVariants}
                  key={value + id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`
                    flex items-center justify-center aspect-square absolute inset-0 w-full h-full dark:bg-primary-900 bg-primary-100 dark:text-white text-black rounded-xl text-center pointer-events-none
                    ${error ? 'border-red-500' : 'border-gray-900'}
                    ${isPending ? 'cursor-not-allowed' : ''}
                  `}
                >
                  {value}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
      <div>
        <AnimatePresence>
          {error && (
            <ErrorPopUp
              className='text-sm sm:text-base col-span-full text-red-500 text-center'
              key="otp-error"
              text={error}
            />
          )}
        </AnimatePresence>
      </div>
      <SubmitButton
        onClick={() => {
          const combinedOtp = otp.join('')
          if (combinedOtp.length === length && !otp.some(char => char === '')) {
            submitOtp(combinedOtp)
          } else {
            setError('لطفا کد را کامل وارد کنید')
          }
        }}
        className="bg-accent-500 dark:bg-accent-400 dark:text-primary-50 text-primary-950 dark:hover:bg-accent-600 hover:bg-accent-300 w-full h-16 sm:h-20 rounded-full text-3xl shadow-xl font-semibold transition-colors duration-200"
        pending={isPending}
        pendingClassName="dark:bg-accent-600 bg-accent-300 text-gray-700 dark:text-gray-700 cursor-not-allowed flex items-center justify-center space-x-2"
        pendingText="در حال ارسال..."
      >
        تایید
      </SubmitButton>
    </div>
  )
}

export default OtpForm
