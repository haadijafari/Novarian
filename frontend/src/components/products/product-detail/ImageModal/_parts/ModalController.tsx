'use client'

import { Dialog } from '@/components/ui/primitives'
import { imageModalTransition } from '@/transitions/imageModal'
import { useTransitionRouter } from 'next-view-transitions'
import { usePathname } from 'next/navigation'

function ModalController({ children }: { children: React.ReactNode }) {
  const router = useTransitionRouter()
  const pathname = usePathname()

  // Derive the open state directly from the URL on every render.
  const isModalOpen = pathname.includes('/image/')

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Update the source of truth (the URL) to close the modal.
      const basePath = pathname.split('/image')[0]
      router.push(basePath, { onTransitionReady: imageModalTransition })
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

export default ModalController
