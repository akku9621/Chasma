import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Select Context
const SelectContext = React.createContext({});

// Select Root Component
export const Select = ({ children, value, onValueChange, defaultValue, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "");
  const selectRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const contextValue = {
    isOpen,
    setIsOpen,
    selectedValue,
    handleValueChange,
    selectRef
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={selectRef} className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

// Select Trigger Component
export const SelectTrigger = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);
  const baseClasses = "flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      className={`${baseClasses} ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      ref={ref}
      {...props}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

// Select Value Component
export const SelectValue = ({ placeholder = "Select...", className = "", ...props }) => {
  const { selectedValue } = React.useContext(SelectContext);
  const baseClasses = "truncate";

  if (!selectedValue) {
    return <span className={`${baseClasses} ${className} text-gray-400`} {...props}>{placeholder}</span>;
  }

  return <span className={`${baseClasses} ${className}`} {...props}>{selectedValue}</span>;
};

// Select Content Component
export const SelectContent = ({ className = "", children, position = "popper", ...props }) => {
  const { isOpen } = React.useContext(SelectContext);
  const baseClasses = "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 bg-gray-800 text-white shadow-md animate-in fade-in-0 zoom-in-95";

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full left-0 mt-1 w-full ${baseClasses} ${className}`}
      {...props}
    >
      <div className="p-1 max-h-60 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// Select Item Component
export const SelectItem = React.forwardRef(({ className = "", children, value, ...props }, ref) => {
  const { selectedValue, handleValueChange } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;
  const baseClasses = "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-700 focus:bg-gray-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

  return (
    <div
      className={`${baseClasses} ${isSelected ? 'bg-gray-700' : ''} ${className}`}
      onClick={() => handleValueChange(value)}
      ref={ref}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
});
