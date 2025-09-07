import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Dialog Context
const DialogContext = React.createContext({});

// Dialog Root Component
export const Dialog = ({ children, open, onOpenChange, defaultOpen = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(open ?? defaultOpen);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const contextValue = {
    isOpen,
    setIsOpen: handleOpenChange
  };

  return (
    <DialogContext.Provider value={contextValue}>
      <div {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  );
};

// Dialog Trigger Component
export const DialogTrigger = React.forwardRef(({ className = "", children, asChild = false, ...props }, ref) => {
  const { setIsOpen } = React.useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: (e) => {
        children.props.onClick?.(e);
        setIsOpen(true);
      },
      ref
    });
  }

  return (
    <button
      className={className}
      onClick={() => setIsOpen(true)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = "DialogTrigger";

// Dialog Content Component
export const DialogContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(DialogContext);

  if (!isOpen) return null;

  const baseClasses = "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-600 bg-gray-900 bg-opacity-95 backdrop-blur-md p-6 shadow-2xl duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dialog Content */}
      <div
        className={`${baseClasses} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
        
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-gray-900 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4 text-gray-400 hover:text-white" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
});

DialogContent.displayName = "DialogContent";

// Dialog Header Component
export const DialogHeader = ({ className = "", children, ...props }) => {
  const baseClasses = "flex flex-col space-y-1.5 text-center sm:text-left";

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Dialog Title Component
export const DialogTitle = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const baseClasses = "text-lg font-semibold leading-none tracking-tight text-white";

  return (
    <h2 className={`${baseClasses} ${className}`} ref={ref} {...props}>
      {children}
    </h2>
  );
});

DialogTitle.displayName = "DialogTitle";

// Dialog Description Component
export const DialogDescription = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const baseClasses = "text-sm text-gray-400";

  return (
    <p className={`${baseClasses} ${className}`} ref={ref} {...props}>
      {children}
    </p>
  );
});

DialogDescription.displayName = "DialogDescription";

// Dialog Footer Component
export const DialogFooter = ({ className = "", children, ...props }) => {
  const baseClasses = "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0";

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Dialog Close Component
export const DialogClose = React.forwardRef(({ className = "", children, asChild = false, ...props }, ref) => {
  const { setIsOpen } = React.useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: (e) => {
        children.props.onClick?.(e);
        setIsOpen(false);
      },
      ref
    });
  }

  return (
    <button
      className={className}
      onClick={() => setIsOpen(false)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

DialogClose.displayName = "DialogClose";