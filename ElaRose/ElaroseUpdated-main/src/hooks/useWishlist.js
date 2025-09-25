"use client"

import { createContext, useContext, useReducer, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from './useToast'

// Wishlist Context
const WishlistContext = createContext()

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const itemId = action.payload._id || action.payload.id;
      if (state.items.some(item => (item._id || item.id) === itemId)) {
        return state // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case 'REMOVE_FROM_WISHLIST':
      const removeId = action.payload._id || action.payload.id;
      return {
        ...state,
        items: state.items.filter(item => (item._id || item.id) !== removeId),
      }

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
      }

    case 'LOAD_WISHLIST':
      return action.payload

    default:
      return state
  }
}

// Initial state
const initialState = {
  items: [],
}

// Wishlist Provider
export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)
  const { user } = useUser()

  // Get user-specific storage key
  const getStorageKey = () => {
    if (!user) return 'elarose-wishlist-guest'
    return `elarose-wishlist-${user.id}`
  }

  // Load wishlist from localStorage on mount or user change
  useEffect(() => {
    const storageKey = getStorageKey()
    const savedWishlist = localStorage.getItem(storageKey)
    
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist })
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
        dispatch({ type: 'CLEAR_WISHLIST' })
      }
    } else {
      // Clear wishlist if no data for current user
      dispatch({ type: 'CLEAR_WISHLIST' })
    }
  }, [user?.id])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const storageKey = getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state, user?.id])

  // Clear all wishlist data when user logs out
  const clearUserData = () => {
    // Clear current user's data
    if (user) {
      localStorage.removeItem(`elarose-wishlist-${user.id}`)
    }
    // Clear guest data
    localStorage.removeItem('elarose-wishlist-guest')
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const addToWishlist = (product) => {
    console.log('Adding to wishlist - original product data:', product);
    
    const existingItem = state.items.find(item => (item._id || item.id) === (product._id || product.id));
    if (existingItem) {
      toast({
        title: "Already in Wishlist",
        description: `${product.name} is already in your wishlist.`,
        variant: "default",
      });
      return;
    }

    const wishlistItem = {
      // Store complete product data
      ...product,
      _id: product._id || product.id,
      id: product.id || product._id,
      addedAt: new Date().toISOString(),
    };
    
    console.log('Adding to wishlist - processed item:', wishlistItem);

    dispatch({
      type: 'ADD_TO_WISHLIST',
      payload: wishlistItem,
    });

    toast({
      title: "Added to Wishlist!",
      description: `${product.name} has been added to your wishlist.`,
      variant: "success",
    });
  }

  const removeFromWishlist = (productId) => {
    const item = state.items.find(item => (item._id || item.id) === productId);
    
    dispatch({
      type: 'REMOVE_FROM_WISHLIST',
      payload: { _id: productId, id: productId },
    });

    if (item) {
      toast({
        title: "Removed from Wishlist",
        description: `${item.name} has been removed from your wishlist.`,
        variant: "default",
      });
    }
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (productId) => {
    return state.items.some(item => (item._id || item.id) === productId)
  }

  const getItemCount = () => {
    return state.items.length
  }

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        clearUserData,
        isInWishlist,
        getItemCount,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Hook to use wishlist
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}