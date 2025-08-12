import { z } from "zod";

export const imageSchema = z.object({
  id: z.number().int().positive(),
  image_url: z.string().url(),
  is_primary: z.boolean()
})

export const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  category: z.array(z.number().int()),
  price: z.string(),
  quantity: z.number().int().positive(),
  tags: z.array(z.string()),
  short_description: z.string(),
  description: z.string(),
  is_draft: z.boolean(),
  created_date: z.string().datetime(),
  modified_date: z.string().datetime(),
  published_date: z.string().datetime(),
  images: z.array(imageSchema),
  primary_image: imageSchema,
});

export type review = {
  title: string,
  discription: string,
  rating: rating,
  pictureURL?: string,
  user: string,
  userIcon: string,
  showName: boolean,
  purchased: boolean,
}

export const cartItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),

  // Fields for Fast UI Display
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  image: z.string().url("Image must be a valid URL").optional(),
});

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = Array<CartItem>
export type Category = { name: string, Icon: string }
export type image = { id: string, src: string }
export type rating = 0 | 1 | 2 | 3 | 4 | 5
