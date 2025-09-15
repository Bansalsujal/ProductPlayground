import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext({});

const SidebarProvider = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div {...props}>{children}</div>
    </SidebarContext.Provider>
  );
};

const Sidebar = ({ children, className = '', ...props }) => (
  <aside className={`w-64 ${className}`} {...props}>{children}</aside>
);

const SidebarHeader = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const SidebarContent = ({ children, className = '', ...props }) => (
  <div className={`flex-1 ${className}`} {...props}>{children}</div>
);

const SidebarFooter = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const SidebarGroup = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const SidebarGroupLabel = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const SidebarGroupContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const SidebarMenu = ({ children, className = '', ...props }) => (
  <nav className={className} {...props}>{children}</nav>
);

const SidebarMenuItem = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const SidebarMenuButton = ({ children, asChild, className = '', ...props }) => {
  if (asChild) {
    return React.cloneElement(children, { className: `${children.props.className || ''} ${className}`, ...props });
  }
  return <button className={className} {...props}>{children}</button>;
};

const SidebarTrigger = ({ className = '', ...props }) => (
  <button className={`md:hidden ${className}`} {...props}>☰</button>
);

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
};