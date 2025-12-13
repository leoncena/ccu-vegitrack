import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useUploadFiles } from '@better-upload/client'
import { UploadDropzone } from '../ui/upload-dropzone'
import { validateFileSize } from '@/lib/storage'
import { toast } from '../ui/sonner'

interface FileUploadProps {
  value?: string | null
  onChange?: (file: File | null) => void
  placeholder?: string
  className?: string
  onError?: (error: string) => void
}

export function FileUpload({ 
  value, 
  onChange, 
  className,
  onError 
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Initialize better-upload hook (we won't actually use it to upload, just for the UI)
  const { control } = useUploadFiles({
    route: 'images', // This won't be used since we override upload
  })

  // Derive preview from selected file or value prop
  const preview = previewUrl || (value && !selectedFile ? value : null)

  const handleFileSelect = useCallback((files: File[]) => {
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file size
    const validation = validateFileSize(file)
    if (!validation.valid) {
      const errorMsg = validation.error || 'File size validation failed'
      toast.error(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file'
      toast.error(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setSelectedFile(file)
    onChange?.(file)
  }, [onChange, onError])

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {preview && (
        <div className="relative w-full rounded-lg overflow-hidden mb-2" style={{ maxHeight: '400px' }}>
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}
      <UploadDropzone
        control={control}
        accept="image/*"
        description={{
          maxFiles: 1,
          maxFileSize: '500KB',
          fileTypes: 'JPEG, PNG, GIF, WebP',
        }}
        uploadOverride={handleFileSelect}
      />
    </div>
  )
}


