'use client'

import { Dialog, DialogClose, DialogContent } from '../../primitives'
import { motion, MotionConfig, type Variants, type HTMLMotionProps, type Transition } from 'framer-motion'
import React from 'react'
import { XIcon } from 'lucide-react'
import { useModalController } from '@/lib/hooks'

const fade_in: Variants = {
  visible: {
    scale: 1,
    opacity: 1,
  },
  hidden: {
    scale: 0.8,
    opacity: 0,
  }
}

type MorphDialogProps = React.ComponentProps<typeof Dialog> & {
  transition?: Transition
  modalKey: string
}

const MorphDialog = ({ transition, modalKey, ...props }: MorphDialogProps) => {
  return (
    <MotionConfig transition={transition}>
      <Dialog data-modal-key={modalKey} {...props} />
    </MotionConfig>
  )
}

type MorphTriggerProps = {
  modalKey: string
} & HTMLMotionProps<'button'>

const MorphTrigger = ({ modalKey, children, ...props }: MorphTriggerProps) => {
  const { openModal } = useModalController() // opens modal by setting ?modal=
  return (
    <motion.button
      layoutId={`Dialog-container-${modalKey}`}
      onClick={() => openModal(modalKey)}
      {...props}
    >
      {children}
    </motion.button>
  )
}

type MorphComponentProps = {
  rule: string
  modalKey: string
} & HTMLMotionProps<'div'>

const MorphComponent = ({ rule, modalKey, ...props }: MorphComponentProps) => {
  return (
    <motion.div
      layoutId={`Dialog-${rule}-${modalKey}`}
      {...props}
    />
  )
}

const MorphContent = ({
  modalKey,
  children,
  showCloseButton = true,
  className,
  ...props
}: React.ComponentProps<typeof DialogContent> & { modalKey: string }) => {

  return (
    <DialogContent
      // Force the wrapper to be invisible, overriding any default styles
      className="bg-transparent shadow-none border-none p-0"
      showCloseButton={false} {...props}>
      <MorphComponent rule='container' modalKey={modalKey} className={className}>
        {children}
      </MorphComponent>
      {showCloseButton && <MorphClose />}
    </DialogContent>
  )
}

const MorphClose = ({ ...props }: HTMLMotionProps<'button'>) => {
  const MotionClose = motion(DialogClose)

  return (
    <MotionClose
      variants={fade_in}
      initial='hidden'
      animate='visible'
      className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </MotionClose>
  )
}

export {
  MorphDialog,
  MorphTrigger,
  MorphComponent,
  MorphContent,
  MorphClose
}
