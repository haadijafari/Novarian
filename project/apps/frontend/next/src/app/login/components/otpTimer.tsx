'use client'
import React, { useEffect, useState } from 'react'


const OtpTimer = ({ expiration }: { expiration: number }) => {
  const [seconds, setSeconds] = useState(expiration)

  const handleResend = () => {
    //TODO: generate otp on server and get expiration from the server
    const newExpiration = 60
    setSeconds(newExpiration)
  }
  // tick down every second until zero
  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  const mins = Math.floor(seconds / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  const timerText = `Resend in ${mins}:${secs}`

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className=""
      onClick={handleResend}
    >
      {seconds > 0 ? timerText : (<>
        didnt get the otp?
        <a
          className='underline text-amber-500 cursor-pointer'
          onClick={handleResend}>
          {' resend'}
        </a>
      </>)}
    </div>
  )
}

export default OtpTimer
