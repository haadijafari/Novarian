import { PlusIcon } from 'lucide-react'
import React from 'react'

const Input = () => {
  return (
    <div className="flex w-full h-full relative items-center">
      <input className="bg-active-muted flex-1 h-full w-full rounded-full px-6 py-3 text-xl" />
      <p className="flex absolute justify-center items-center h-4/5 aspect-square translate-x-[12%] bg-surface-accent rounded-full left-0">
        <PlusIcon />
      </p>
    </div>
  )
}

export default Input
