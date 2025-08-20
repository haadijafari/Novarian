import {
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ModalController } from "@/components/ui/modalController";
import { type image } from '@/lib/schemas/schemas'
import ImageGallery from '@/components/products/image-gallery'

export default async function ImageModal({ params }: { params: Promise<{ img: string }> }) {
  // TODO: fetch the product here
  // Simulate delay only once when slug changes (page load)
  await new Promise((res) => setTimeout(res, 100))

  const images: Array<image> = [
    { id: '1', src: '/1.jpg' },
    { id: '2', src: '/2.jpg' },
    { id: '3', src: '/3.jpg' },
    { id: '4', src: '/4.jpg' },
  ]

  const { img } = await params
  const altText = `Enlarged view of product image ${img}`;

  return (
    <ModalController>
      <DialogContent className="max-w-5xl w-auto p-0 bg-transparent border-0">
        {/* Add the hidden title and description for screen readers */}
        <DialogTitle className="sr-only">{altText}</DialogTitle>
        <DialogDescription className="sr-only">
          A larger, more detailed view of the product.
        </DialogDescription>
        <ImageGallery id="test2" className='flex-[4]' images={images} />
      </DialogContent>
    </ModalController>
  );
}
