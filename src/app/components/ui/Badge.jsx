import React from "react";

const Badge = ({ 
  children, 
  className = "", 
  variant = "default",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-300 bg-transparent text-gray-700",
    secondary: "bg-gray-200 text-gray-900"
  };

  const variantClasses = variants[variant] || variants.default;

  return (
    <span 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;