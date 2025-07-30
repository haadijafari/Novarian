import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  price: z.number().positive(),
});

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

export type ratings = 0 | 1 | 2 | 3 | 4 | 5
