'use client';

import { Dialog } from '@/components/ui/dialog';
import { useRouter, usePathname } from 'next/navigation';

export function ModalController({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Derive the open state directly from the URL on every render.
  const isModalOpen = pathname.includes('/image/');

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Update the source of truth (the URL) to close the modal.
      const basePath = pathname.split('/image')[0];
      router.push(basePath);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}
