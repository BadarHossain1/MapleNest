"use client"

import * as React from "react"

const RadioGroup = React.forwardRef(({ className, onValueChange, value, children, ...props }, ref) => {
  const handleChange = (event) => {
    if (onValueChange) {
      onValueChange(event.target.value)
    }
  }

  return (
    <div
      ref={ref}
      className={`grid gap-2 ${className || ''}`}
      onChange={handleChange}
      {...props}
    >
      {children}
    </div>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, value, children, ...props }, ref) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        ref={ref}
        value={value}
        className={`
          h-4 w-4 border border-gray-300 rounded-full
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          checked:bg-blue-500 checked:border-blue-500
          disabled:cursor-not-allowed disabled:opacity-50
          ${className || ''}
        `}
        {...props}
      />
      {children}
    </label>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }