import { Brush, LaptopMinimal, Mars, MessageCircleQuestion, Venus } from 'lucide-react';
import React from 'react';

const icons = {
  "brush": Brush,
  "laptop-minimal": LaptopMinimal,
  "mars": Mars,
  "message-circle-question": MessageCircleQuestion,
  "venus": Venus
} as const;

export type IconName = keyof typeof icons;

// It checks if a given string is one of the keys of our icons object
function isIconName(name: string): name is IconName {
  return name in icons;
}

const Icon = ({ iconName }: { iconName: string }) => {
  // We use the type guard to validate the string.
  // If it's a valid name, we use it. If not, we use the fallback.
  const ICON = isIconName(iconName)
    ? icons[iconName]
    : MessageCircleQuestion;

  return (
    <ICON>Icon</ICON>
  );
}

export default Icon;
