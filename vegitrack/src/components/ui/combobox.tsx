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

  React.useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full flex items-center justify-between", className)}
          style={{
            fontFamily: 'var(--font-body)',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            borderRadius: 'var(--radius-md)',
            marginTop: 'var(--spacing-card)',
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
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start"
        style={{ width: popoverWidth ? `${popoverWidth}px` : undefined }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
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
      </PopoverContent>
    </Popover>
  )
}

