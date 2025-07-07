'use client'
import { toPersian } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

const OtpTimer = ({ expiration }: { expiration: number }) => {
  const [seconds, setSeconds] = useState(expiration)

  const handleResend = () => {
    //TODO: generate otp on server and get expiration from the server
    const newExpiration = 60
    setSeconds(newExpiration)
  }

  // Tick down every second until zero
  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  // Calculate minutes and seconds
  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')

  // Create the Persian timer text
  const timerText = `ارسال مجدد کد تا ${toPersian(mins)}:${toPersian(secs)}`

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="text-center" // Center the text
    >
      {seconds > 0 ? (
        // Display the countdown timer
        <p>{timerText}</p>
      ) : (
        // Display the resend link
        <p>
          کد را دریافت نکردید؟
          <a
            className='underline text-accent-500 cursor-pointer mr-1' // Added margin for spacing
            onClick={handleResend}
          >
            ارسال مجدد
          </a>
        </p>
      )}
    </div>
  )
}

export default OtpTimer
