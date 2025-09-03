import { ReviewForm } from "@/components/products/product-detail/customer-reviews"
import { ModalController } from "@/components/products/product-detail/ImageModal/_parts"
import {
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/primitives"

export default async function ImageModal() {

  return (
    <ModalController>
      <DialogContent className="max-w-5xl w-auto p-0 bg-transparent border-0">
        {/* Add the hidden title and description for screen readers */}
        <DialogTitle className="sr-only">{"reviewForm"}</DialogTitle>
        <DialogDescription className="sr-only">
          A larger, more detailed view of the product.
        </DialogDescription>
        <ReviewForm />
      </DialogContent>
    </ModalController>
  )
}
