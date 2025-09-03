import { cn } from '@/lib/utils'
import { LucideProps } from 'lucide-react'
import React, { InputHTMLAttributes } from 'react'

interface InputWithIconProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  placeholder: string
  id: string
  labelClassName?: string
  persian?: boolean
  iconSize?: string
  IconComponent: React.ElementType<LucideProps>
}

const InputWithIcon = ({
  id,
  placeholder,
  IconComponent,
  className,
  labelClassName,
  persian = false,
  iconSize = "18",
  ...inputProps
}: InputWithIconProps) => (
  <div className="input-box w-full relative">
    <input
      placeholder=' '
      className={cn(className, persian && "text-right", "peer")}
      {...inputProps}
      id={id}
    />

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
        labelClassName, persian ? "mr-3 right-2.5" : "ml-4 left-4")}
    >
      {placeholder}
    </label>

    <div
      className={cn(
        "flex justify-center items-center absolute h-2/3 aspect-square rounded-full top-1/2 transform -translate-y-1/2 text-ink-muted",
        persian ? "left-0 translate-x-1/4" : "right-0 -translate-x-1/4")}
    >
      <IconComponent
        size={iconSize}
      />
    </div>
  </div >
)

export default InputWithIcon 
