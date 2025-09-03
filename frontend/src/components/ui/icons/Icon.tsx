import { type LucideProps, Brush, LaptopMinimal, Mars, MessageCircleQuestion, Venus } from 'lucide-react'
import React from 'react'

const icons = {
  "brush": Brush,
  "laptop-minimal": LaptopMinimal,
  "mars": Mars,
  "message-circle-question": MessageCircleQuestion,
  "venus": Venus
} as const

export type IconName = keyof typeof icons

// It checks if a given string is one of the keys of our icons object
function isIconName(name: string): name is IconName {
  return name in icons
}

type IconProps = {
  iconName: string
} & LucideProps

const Icon = ({ iconName, ...props }: IconProps) => {
  // We use the type guard to validate the string.
  // If it's a valid name, we use it. If not, we use a fallback.
  const ICON = isIconName(iconName)
    ? icons[iconName]
    : MessageCircleQuestion

  return <ICON {...props} />
}

export default Icon
