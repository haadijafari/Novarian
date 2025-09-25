import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../../primitives'
import { motion, MotionConfig, type Variants, type HTMLMotionProps, type Transition } from 'framer-motion'
import React, { useContext, useId, useMemo } from 'react';
import { XIcon } from 'lucide-react';

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

const MorphingDialogContext =
  React.createContext<{ uniqueId: string } | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      'useMorphingDialog must be used within a MorphingDialogProvider'
    );
  }
  return context;
}


const MorphDialog = ({
  transition,
  ...props
}: React.ComponentProps<typeof Dialog>
  & { transition?: Transition }) => {

  const uniqueId = useId()
  const contextValue = useMemo(
    () => ({
      uniqueId,
    }),
    [uniqueId]
  );


  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>
        <Dialog {...props} />
      </MotionConfig>
    </MorphingDialogContext.Provider>
  )
}

const MorphTrigger = ({
  ...props
}: HTMLMotionProps<"button">) => {
  const { uniqueId } = useMorphingDialog()

  return (
    <DialogTrigger asChild>
      <motion.button
        layoutId={`Dialog-container-${uniqueId}`}
        {...props}
      />
    </DialogTrigger>
  )
}

const MorphComponent = ({
  rule,
  ...props
}: { rule: string }
  & HTMLMotionProps<"div">
) => {
  const { uniqueId } = useMorphingDialog()

  return (
    <motion.div
      layoutId={`Dialog-${rule}-${uniqueId}`}
      {...props}
    />
  )
}

export const MorphContent = ({
  children,
  showCloseButton = true,
  className,
  ...props
}: React.ComponentProps<typeof DialogContent>) => {

  return (
    <DialogContent
      // Force the wrapper to be invisible, overriding any default styles
      className="bg-transparent shadow-none border-none p-0"
      showCloseButton={false} {...props}>
      <MorphComponent rule='container' className={className}>
        {children}
      </MorphComponent>
      {showCloseButton && <MorphClose />}
    </DialogContent>
  )
}

const MorphClose = ({ ...props }: HTMLMotionProps<"button">) => {
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
  MorphClose
}
