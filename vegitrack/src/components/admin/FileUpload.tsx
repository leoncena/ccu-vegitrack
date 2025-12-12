import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  value?: string | null
  onChange?: (url: string) => void
  placeholder?: string
  className?: string
}

export function FileUpload({ value, onChange, placeholder = 'https://placehold.co/600x400/EEE/31343C', className }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // For now, just use placeholder URL
      // In the future, this would upload to storage and get the URL
      const url = placeholder
      setPreview(url)
      onChange?.(url)
    }
  }

  const displayUrl = preview || placeholder

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className="relative w-full border-2 border-dashed rounded-lg overflow-hidden"
        style={{
          borderColor: 'var(--color-border)',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {displayUrl && (
          <img
            src={displayUrl}
            alt="Upload preview"
            className="w-full h-full object-cover"
            style={{ maxHeight: '400px' }}
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {!displayUrl && (
          <div
            className="text-center p-4"
            style={{ color: 'var(--color-text-light)' }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              Click to upload image
            </div>
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-text-light)' }}>
        Using placeholder image. File upload will be implemented later.
      </div>
    </div>
  )
}

