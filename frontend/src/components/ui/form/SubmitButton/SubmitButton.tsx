'use client'

import { Loader2 } from 'lucide-react'
import React, { ComponentPropsWithoutRef } from 'react'

interface SubmitButtonProps
  extends ComponentPropsWithoutRef<'button'> {
  pending: boolean
  pendingClassName: string
  pendingText: string
}

function SubmitButton({ onClick, pendingText, children, pending: isPending, className, pendingClassName }: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={isPending}
      aria-busy={isPending}
      aria-label={isPending ? 'Logging in…' : undefined}
      className={`${className} ${isPending && pendingClassName}`}
    >
      {isPending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{pendingText}</span>
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  )
}

export default SubmitButton
