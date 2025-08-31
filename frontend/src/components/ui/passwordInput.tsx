import { cn } from '@/lib/utils'
import { EyeClosedIcon, EyeIcon, LucideProps } from 'lucide-react'
import { motion, HTMLMotionProps, AnimatePresence } from 'motion/react'
import React, { InputHTMLAttributes, useState } from 'react'

interface PasswordInput
  extends Omit<HTMLMotionProps<'input'>, 'placeholder'> {
  placeholder: string
  id: string
  labelClassName?: string
  persian?: boolean
  iconSize?: string
}

const PasswordInput = ({
  id,
  placeholder,
  className,
  labelClassName,
  persian = false,
  iconSize = "18",
  ...inputProps
}: PasswordInput) => {
  const [isHidden, setIsHidden] = useState(true)
  //WARNING: this should not lose the focus after state change and should think something about what to do with value

  const state = isHidden ? 'hidden' : 'visible'

  const handleClick = () => {
    setIsHidden(!isHidden)
  }

  const Icon = isHidden ? EyeClosedIcon : EyeIcon

  return (
    <div
      className={cn(
        "border-2 border-divider rounded-full outline-none input-box w-full relative h-full",
      )}
    >
      <AnimatePresence initial={false}>
        <motion.input
          key={state}
          initial={{ clipPath: "circle(0% at 10% 50%)" }}
          animate={{ clipPath: "circle(150% at 10% 50%)" }}
          exit={{ opacity: 0.99 }}
          transition={{ duration: 0.3, ease: "linear" }}
          value={"ali@bahmani"}
          type={isHidden ? 'password' : 'text'}
          placeholder=' '
          className={cn(
            isHidden ? 'bg-surface-sharp text-ink' : "bg-ink text-surface",
            persian && "text-right",
            "peer rounded-full w-full h-full absolute inset-0",
            className,
          )}
          {...inputProps}
          id={id}
        />
      </AnimatePresence>
      <label
        htmlFor={id}
        className={cn(
          "absolute text-ink-muted delay-100 duration-200 ease-in-out top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          ,
          `
        peer-focus:top-0
        peer-[:not(:placeholder-shown)]:top-0

        peer-focus:text-sm
        peer-[:not(:placeholder-shown)]:text-sm

        peer-focus:py-0
        peer-[:not(:placeholder-shown)]:py-0

        peer-focus:px-2.5
        peer-[:not(:placeholder-shown)]:px-2.5

        peer-focus:bg-surface-muted
        peer-[:not(:placeholder-shown)]:bg-surface-muted

        peer-focus:text-ink-muted peer-[:not(:placeholder-shown)]:text-ink-muted
        `,
          labelClassName, persian ? "mr-2.5 right-2.5" : "ml-3 left-3")}
      >
        {placeholder}
      </label>

      <motion.button
        key={state}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'linear', duration: 0.3 }}
        className={cn(
          "flex justify-center items-center absolute h-2/3 aspect-square rounded-full top-1/2 transform -translate-y-1/2 ",
          persian ? "left-0 translate-x-1/4" : "right-0 -translate-x-1/4",
          isHidden ? 'text-ink-accent bg-surface-accent' : 'bg-surface-accent text-ink-accent'
        )}
        onClick={handleClick}
      >
        <Icon
          size={iconSize}
        />
      </motion.button>
    </div >
  )
}

export default PasswordInput
