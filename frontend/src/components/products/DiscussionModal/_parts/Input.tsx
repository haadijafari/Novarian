import { PlusIcon } from 'lucide-react'
import React from 'react'

const Input = () => {
  return (
    <div className="flex w-full h-full relative items-center">
      <input className="bg-active-muted flex-1 h-full w-full rounded-full px-8 text-2xl" />
      <p className="flex justify-center items-center h-4/5 aspect-square translate-x-[115%] bg-surface-accent rounded-full left-0">
        <PlusIcon className="" />
      </p>
    </div>
  )
}

export default Input
