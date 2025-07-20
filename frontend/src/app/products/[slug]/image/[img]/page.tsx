import ProductPage from '../../page'; // main product page
import ImageModal from '../../@modal/image/[img]/page'; // nested modal content

// This is the page that renders on a direct visit or hard refresh
export default async function ProductPageWithImageModal({ params }: { params: Promise<{ slug: string, img: string }> }) {
  const { slug, img } = await params

  return (
    <>
      <ProductPage params={Promise.resolve({ slug })} />

      {/* This renders modal content on top */}
      <ImageModal params={Promise.resolve({ img })} />
    </>
  );
}
