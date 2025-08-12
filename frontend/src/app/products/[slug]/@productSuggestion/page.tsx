import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { mockProducts } from "../../../../../public/mockProducts"
import ProductCard from "@/components/products/ProductCard"

export default function CarouselSpacing() {
  //TODO: fetch from product suggestions
  const products = mockProducts

  return (
    <Carousel dir="ltr" className="w-full max-w-[90%]">
      <CarouselContent className="-ml-1">
        {products.map((product, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/4">
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}

      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

