import ReviewForm from "@/components/products/reviewForm";
import {
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ModalController } from "@/components/ui/modalController";

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
  );
}
