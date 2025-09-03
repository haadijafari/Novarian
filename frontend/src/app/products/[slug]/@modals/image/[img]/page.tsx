import ModalGallery from "@/components/products/product-detail/ImageModal"
import { ModalController } from "@/components/products/product-detail/ImageModal/_parts"
import {
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/primitives"
import { type image } from '@/lib/schemas/schemas'

async function ImageModal({ params }: { params: Promise<{ img: string }> }) {
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
  const altText = `Enlarged view of product image ${img}`

  return (
    <ModalController>
      <DialogContent variant='imageModal'>
        {/* Add the hidden title and description for screen readers */}
        <DialogTitle className="sr-only">{altText}</DialogTitle>
        <DialogDescription className="sr-only">
          A larger, more detailed view of the product.
        </DialogDescription>
        <ModalGallery id="test1" images={images} />
      </DialogContent>
    </ModalController>
  )
}

export default ImageModal
