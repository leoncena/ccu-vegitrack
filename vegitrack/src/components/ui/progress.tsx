import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className = "", value, ...props }, ref) => {
  const clampedValue = Math.min(100, Math.max(0, value || 0))
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={`relative h-4 w-full overflow-hidden ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '2px',
        border: '1px solid var(--color-primary)',
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full transition-all duration-300"
        style={{
          width: `${clampedValue}%`,
          backgroundColor: 'var(--color-primary)',
          borderRadius: '2px',
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

