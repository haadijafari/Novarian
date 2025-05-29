import { LucideProps } from 'lucide-react'
import React, { InputHTMLAttributes } from 'react'

interface InputWithIconProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  placeholder: string
  id: string
  iconSize?: string
  IconComponent: React.ElementType<LucideProps>
}

const InputWithIcon = ({
  id,
  placeholder,
  IconComponent,
  className,
  iconSize = "18",
  ...inputProps
}: InputWithIconProps) => (
  <div className="input-box w-full relative">
    <input
      className={`${className} peer`}
      {...inputProps}
      id={id}
    />

    <label
      htmlFor={id}
      className="absolute text-gray-600 delay-100 duration-200 ease-in-out left-3 text-xl top-1/2 transform -translate-y-1/2 rounded-full ml-4
         peer-focus:left-4 peer-focus:bg-gray-600 peer-focus:text-white peer-focus:top-0 peer-focus:text-sm pointer-events-none peer-focus:py-0 peer-focus:px-2.5"
    >
      {placeholder}
    </label>

    <IconComponent
      size={iconSize}
      style={{ right: "18px" }}
      className={`absolute top-1/2 transform -translate-y-1/2 text-black`}
    />
  </div>
)

export default InputWithIcon

