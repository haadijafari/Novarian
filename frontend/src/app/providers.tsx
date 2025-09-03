'use client'

import { ThemeProvider } from "next-themes"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import { type CartItem } from "@/lib/schemas/schemas"


interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, newQuantity: number) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * The CartProvider component is responsible for managing the cart's state
 * and synchronizing it with localStorage.
 */
function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // On initial load, try to retrieve the cart from localStorage.
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('shoppingCart')
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error)
      setCartItems([])
    }
  }, [])

  // Whenever the cartItems state changes, save the new state to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cartItems])

  /**
   * Adds an item to the cart. If the item already exists, its quantity is incremented.
   */
  const addToCart = (itemToAdd: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.productId === itemToAdd.productId)
      if (existingItem) {
        // If item exists, map over the array and update the quantity of the matching item
        return prevItems.map(i =>
          i.productId === itemToAdd.productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      // If item doesn't exist, add it to the cart with a quantity of 1
      return [...prevItems, { ...itemToAdd, quantity: 1 }]
    })
  }

  /**
   * Removes an item completely from the cart, regardless of its quantity.
   */
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId))
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * If the new quantity is 0 or less, the item is removed.
   */
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  /**
   * Clears all items from the shopping cart.
   */
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate the total number of items in the cart
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  // The value object provided to consuming components
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * Custom hook for easy access to the cart context.
 * This ensures components are wrapped in CartProvider and provides clean access to the context value.
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}


export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <CartProvider>
      {children}
    </CartProvider>
  </ThemeProvider>
}
