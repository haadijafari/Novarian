import { PlusIcon } from 'lucide-react'
import React, { useRef } from 'react'

const Input = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto' // reset
    el.style.height = `${el.scrollHeight}px` // expand with content
  }

  return (
    <div className="flex w-full relative items-center">
      <textarea
        ref={textareaRef}
        onInput={resize}
        rows={1}
        className="bg-active-muted flex-1 w-full rounded-4xl pr-6 pl-14 py-3 text-xl resize-none overflow-hidden leading-relaxed"
      />
      <p
        className="flex absolute justify-center items-center translate-x-[12%] bg-surface-accent rounded-full left-0 w-10 h-10"
      >
        <PlusIcon />
      </p>
    </div>
  )
}

export default Input
