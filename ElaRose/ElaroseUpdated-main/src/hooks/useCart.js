"use client"

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

// Cart Context
const CartContext = createContext()

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && 
            JSON.stringify(item.variant) === JSON.stringify(action.payload.variant))
        ),
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && 
          JSON.stringify(item.variant) === JSON.stringify(action.payload.variant)
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }

    case 'LOAD_CART':
      return action.payload

    default:
      return state
  }
}

// Initial state
const initialState = {
  items: [],
  isOpen: false,
}

// Cart Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user } = useUser()

  // Get user-specific storage key
  const getStorageKey = () => {
    if (!user) return 'elarose-cart-guest'
    return `elarose-cart-${user.id}`
  }

  // Load cart from localStorage on mount or user change
  useEffect(() => {
    const storageKey = getStorageKey()
    const savedCart = localStorage.getItem(storageKey)
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        dispatch({ type: 'CLEAR_CART' })
      }
    } else {
      // Clear cart if no data for current user
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [user?.id])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const storageKey = getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, user?.id])

  // Clear all cart data when user logs out
  const clearUserData = () => {
    // Clear current user's data
    if (user) {
      localStorage.removeItem(`elarose-cart-${user.id}`)
    }
    // Clear guest data
    localStorage.removeItem('elarose-cart-guest')
    dispatch({ type: 'CLEAR_CART' })
  }

  const addToCartLocal = (product, variant = null, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        variant,
        quantity,
      },
    })
  }

  const removeFromCart = (productId, variant = null) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: productId, variant },
    })
  }

  const updateQuantity = (productId, variant = null, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant)
      return
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, variant, quantity },
    })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const isInCart = (productId, variant = null) => {
    return state.items.some(item => 
      item.id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    )
  }

  const getItemQuantity = (productId, variant = null) => {
    const item = state.items.find(item => 
      item.id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    )
    return item ? item.quantity : 0
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addToCart: addToCartLocal,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearUserData,
        getItemCount,
        getTotal,
        isInCart,
        getItemQuantity,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart with API integration
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  // Check if user is a guest
  const isGuestUser = useCallback((userEmail) => {
    return userEmail.startsWith('guest_')
  }, [])

  // API-based add to cart function (matching original structure)
  const addToCart = useCallback(async (cartData) => {
    try {
      setLoading(true)
      setError(null)

      // If guest user, handle locally  
      if (isGuestUser(cartData.userEmail)) {
        const guestId = cartData.userId
        const cartKey = `guest_cart_${guestId}`
        const existingCart = localStorage.getItem(cartKey)
        const cartItems = existingCart ? JSON.parse(existingCart) : []

        // Check if item already exists
        const existingItemIndex = cartItems.findIndex(item =>
          item.productId === cartData.productId &&
          item.selectedSize === cartData.selectedSize &&
          item.selectedColor === cartData.selectedColor
        )

        if (existingItemIndex > -1) {
          // Update quantity
          cartItems[existingItemIndex].quantity += cartData.quantity || 1
          cartItems[existingItemIndex].updatedAt = new Date().toISOString()
        } else {
          // Add new item
          cartItems.push({
            _id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...cartData,
            quantity: cartData.quantity || 1,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }

        localStorage.setItem(cartKey, JSON.stringify(cartItems))
        return { success: true }
      }

      // For logged-in users, use API
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      })

      const result = await response.json()
      return result

    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: 'Failed to add item to cart' }
    } finally {
      setLoading(false)
    }
  }, [apiUrl, isGuestUser])

  return {
    ...context,
    addToCartAPI: addToCart, // Rename API version to avoid conflict
    loading,
    error
  }
}