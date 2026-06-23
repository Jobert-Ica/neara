import * as React from "react"

export const Switch = React.forwardRef<HTMLInputElement, any>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={className}
        ref={ref}
        {...props}
      />
    )
  }
)
Switch.displayName = "Switch"
