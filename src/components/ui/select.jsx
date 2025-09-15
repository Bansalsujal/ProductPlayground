import React, { useState, useRef, useEffect } from 'react';

const Select = ({ children, onValueChange, defaultValue, value, required }) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            onClick: () => setIsOpen(!isOpen),
            value: currentValue,
            isOpen
          });
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, { 
            onValueChange: handleValueChange, 
            selectedValue: currentValue 
          }) : null;
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, className = '', onClick, isOpen, ...props }) => (
  <button
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
    <svg
      className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

const SelectContent = ({ children, onValueChange, selectedValue, className = '', ...props }) => (
  <div
    className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto ${className}`}
    style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
    {...props}
  >
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { onValueChange, selectedValue });
      }
      return child;
    })}
  </div>
);

const SelectItem = ({ children, value, className = '', onValueChange, selectedValue, ...props }) => (
  <div
    className={`relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm hover:bg-gray-50 ${
      selectedValue === value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-900 bg-white'
    } ${className}`}
    style={{ backgroundColor: selectedValue === value ? '#eef2ff' : '#ffffff' }}
    onClick={() => onValueChange && onValueChange(value)}
    {...props}
  >
    {selectedValue === value && (
      <svg className="absolute left-2 h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )}
    <span className={selectedValue === value ? 'ml-6' : ''}>{children}</span>
  </div>
);

const SelectValue = ({ placeholder, children }) => {
  return (
    <span className="text-gray-900">
      {children || placeholder}
    </span>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };