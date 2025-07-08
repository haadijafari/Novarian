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
      className={`${className} peer ${persian && "text-right"}`}
      {...inputProps}
      id={id}
    />

    <label
      htmlFor={id}
      className={`
      ${labelClassName}
      absolute text-primary-950 dark:text-primary-50 
      delay-100 duration-200 ease-in-out
      top-1/2 -translate-y-1/2 rounded-full 
      pointer-events-none

      ${persian ? "mr-4 right-4" : "ml-4 left-4"}

      peer-focus:top-0
      peer-[:not(:placeholder-shown)]:top-0

      peer-focus:text-sm
      peer-[:not(:placeholder-shown)]:text-sm

      peer-focus:py-0
      peer-[:not(:placeholder-shown)]:py-0

      peer-focus:px-2.5
      peer-[:not(:placeholder-shown)]:px-2.5

      peer-focus:bg-primary-900
      peer-[:not(:placeholder-shown)]:bg-primary-900

      peer-focus:text-primary-50
      peer-[:not(:placeholder-shown)]:text-primary-50
  `}
    >
      {placeholder}
    </label>

    <IconComponent
      size={iconSize}
      style={persian ? { left: `${iconSize}px` } : { right: `${iconSize}px` }}
      className={`absolute top-1/2 transform -translate-y-1/2 text-primary-50`}
    />
  </div >
)

export default InputWithIcon

