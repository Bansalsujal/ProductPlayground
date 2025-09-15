import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext({});

const Dialog = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;
  
  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogContent = ({ children, className = '', ...props }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-xl rounded-lg" style={{ backgroundColor: '#ffffff' }}>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
        <div className={className} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = '', ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle };