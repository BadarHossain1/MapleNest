"use client";

import React from "react";

export function Slider({ 
  className = "",
  min = 0, 
  max = 100, 
  value = [min, max],
  onValueChange,
  ...props 
}) {
  const [internalValue, setInternalValue] = React.useState(value);
  
  const handleChange = (e, index) => {
    const newValue = [...internalValue];
    newValue[index] = parseInt(e.target.value);
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div className={`relative flex w-full touch-none items-center select-none ${className}`}>
      <div className="relative flex-grow h-2 bg-gray-200 rounded-full">
        <div 
          className="absolute h-full bg-[#f2c9c7] rounded-full"
          style={{
            left: `${((internalValue[0] - min) / (max - min)) * 100}%`,
            width: `${((internalValue[1] - internalValue[0]) / (max - min)) * 100}%`
          }}
        />
        {internalValue.map((val, index) => (
          <input
            key={index}
            type="range"
            min={min}
            max={max}
            value={val}
            onChange={(e) => handleChange(e, index)}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{
              background: 'transparent',
              outline: 'none',
            }}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}