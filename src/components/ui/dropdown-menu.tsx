import * as React from "react"

export const DropdownMenu = ({ children }: any) => <div className="relative inline-block text-left">{children}</div>
export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, any>(({ children, className, ...props }, ref) => (
  <button ref={ref} className={className} {...props}>{children}</button>
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent = ({ children, align, className }: any) => (
  <div className={`absolute z-50 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${align === 'end' ? 'right-0' : 'left-0'} ${className}`}>
    <div className="py-1">{children}</div>
  </div>
)

export const DropdownMenuItem = ({ children, onClick, className }: any) => (
  <button onClick={onClick} className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}>
    {children}
  </button>
)
