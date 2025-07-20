'use client';

import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ModalController({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  // This function closes the modal and navigates back
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.back();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}
