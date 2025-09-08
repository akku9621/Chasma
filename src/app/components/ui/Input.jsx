
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Input Component
export const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  const baseClasses = "flex h-10 w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";
  
  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
