'use client'

import React from 'react'
import OtpForm from './OtpForm'
import { ShieldCheck } from 'lucide-react'
import OtpTimer from './otpTimer'
import { otpSubmit } from './actions'

type Props = { phoneNumber: string }
otpSubmit

const OtpPage = ({ phoneNumber }: Props) => {

  //TODO: fetch the expiration and send it to otp timer
  const otpExpiration = 1

  return (
    <div className='text-center w-full fill-current flex-col flex items-center rounded-lg'>
      <ShieldCheck
        className="
        p-2 rounded-full m-2
        w-[clamp(10rem,12vw,20rem)]
        h-[clamp(10rem,12vw,20rem)]"
      />
      <div>
        <h1 className='text-xl font-semibold'>enter otp sent to phone {phoneNumber}</h1>
        <OtpForm length={4} submitForm={otpSubmit} />
        <OtpTimer expiration={otpExpiration} />
      </div>
    </div>
  )
}

export default OtpPage
