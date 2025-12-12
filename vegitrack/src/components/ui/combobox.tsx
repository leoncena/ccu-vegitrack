import * as React from "react"
import { Check, ChevronsUpDown, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  rightIcon?: LucideIcon
  getDisplayValue?: (option: ComboboxOption | undefined) => string
}

export function Combobox({
  options,
  value,
  onValueChange,
  onOpenChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  rightIcon: RightIcon,
  getDisplayValue,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(undefined)

  const selectedOption = options.find((option) => option.value === value)
  const displayValue = getDisplayValue 
    ? getDisplayValue(selectedOption)
    : selectedOption 
      ? selectedOption.label 
      : placeholder

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  // Detect mobile viewport
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  React.useEffect(() => {
    if (triggerRef.current && !isMobile) {
      setPopoverWidth(triggerRef.current.offsetWidth)
    }
  }, [open, isMobile])

  const commandContent = (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.label}
              onSelect={() => {
                onValueChange?.(value === option.value ? "" : option.value)
                setOpen(false)
              }}
              className="!pl-1 pr-1"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  const triggerButton = (
    <Button
      ref={triggerRef}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      onClick={() => setOpen(true)}
      className={cn("w-full flex items-center justify-between", className)}
      style={{
        fontFamily: 'var(--font-body)',
        height: '42px',
        borderRadius: '8px',
        borderWidth: '1.5px',
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-background)',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        marginTop: 'calc(var(--spacing-card) * 0.5)',
        color: 'var(--color-text)',
      }}
    >
      <div 
        className="flex items-center gap-2 flex-1 min-w-0"
        style={{ paddingLeft: 'var(--spacing-card)' }}
      >
        {RightIcon && <RightIcon className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} />}
        <span className="text-left truncate">{displayValue}</span>
      </div>
      <div style={{ paddingRight: 'var(--spacing-card)' }}>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </div>
    </Button>
  )

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent
            className={cn(
              "p-0 max-w-full w-full rounded-b-none rounded-t-lg border-b-0",
              "fixed top-0 left-0 right-0 !translate-y-0 !translate-x-0",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
              "sm:hidden transition-transform duration-200"
            )}
            style={{
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
            }}
          >
            {commandContent}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start"
        side="top"
        style={{ width: popoverWidth ? `${popoverWidth}px` : undefined }}
      >
        {commandContent}
      </PopoverContent>
    </Popover>
  )
}

