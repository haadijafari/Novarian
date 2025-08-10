import {
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ModalController } from "@/components/ui/modalController";
import Image from "next/image";

export default async function ImageModal({ params }: { params: Promise<{ img: string }> }) {
  const { img } = await params
  const imageSrc = `/${img}.jpg`;
  const altText = `Enlarged view of product image ${img}`;

  return (
    <ModalController>
      <DialogContent className="max-w-5xl w-auto p-0 bg-transparent border-0">
        {/* Add the hidden title and description for screen readers ♿ */}
        <DialogTitle className="sr-only">{altText}</DialogTitle>
        <DialogDescription className="sr-only">
          A larger, more detailed view of the product.
        </DialogDescription>

        <Image
          src={imageSrc}
          alt={altText}
          width={1800}
          height={1200}
          className="w-full h-auto"
        />
      </DialogContent>
    </ModalController>
  );
}
