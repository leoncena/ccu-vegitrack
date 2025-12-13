import { cn } from '@/lib/utils'
import type { UploadHookControl } from '@better-upload/client'
import { Loader2, Upload } from 'lucide-react'
import { useId } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { toast } from './sonner'

type UploadDropzoneProps = {
  control: UploadHookControl<true>
  id?: string
  accept?: string
  metadata?: Record<string, unknown>
  description?:
    | {
        fileTypes?: string
        maxFileSize?: string
        maxFiles?: number
      }
    | string
  uploadOverride?: (
    files: File[],
    options?: { metadata?: Record<string, unknown> }
  ) => void
  className?: string
}

export function UploadDropzone({
  control: { upload, isPending },
  id: _id,
  accept,
  metadata,
  description,
  uploadOverride,
  className,
}: UploadDropzoneProps) {
  const id = useId()

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: (files) => {
      if (files.length > 0 && !isPending) {
        if (uploadOverride) {
          uploadOverride(files, { metadata })
        } else {
          upload(files, { metadata })
        }
      }
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    onDropRejected: (fileRejections: FileRejection[]) => {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            const maxSize = typeof description === 'object' ? description?.maxFileSize : '500KB'
            const fileSizeKB = (rejection.file.size / 1024).toFixed(2)
            const fileSizeMB = (rejection.file.size / (1024 * 1024)).toFixed(2)
            toast.error(
              `Image is too large! Maximum size is ${maxSize}, but your file is ${fileSizeKB}KB (${fileSizeMB}MB). Please compress or resize the image before uploading.`
            )
          } else if (error.code === 'file-invalid-type') {
            toast.error('Invalid file type. Please select an image file (JPEG, PNG, GIF, or WebP).')
          } else if (error.code === 'too-many-files') {
            const maxFiles = typeof description === 'object' ? (description?.maxFiles || 1) : 1
            toast.error(`Too many files. Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed.`)
          } else {
            toast.error(`File rejected: ${error.message || 'Unknown error'}`)
          }
        })
      })
    },
    noClick: false,
    accept: accept ? { [accept]: [] } : undefined,
    maxFiles: typeof description === 'object' ? description?.maxFiles : undefined,
    maxSize: typeof description === 'object' && description?.maxFileSize
      ? parseFileSize(description.maxFileSize)
      : undefined,
  })

  return (
    <div
      className={cn(
        'border-input text-foreground relative rounded-lg border border-dashed transition-colors',
        {
          'border-primary/80': isDragActive,
        },
        className
      )}
    >
      <label
        {...getRootProps()}
        className={cn(
          'dark:bg-input/10 flex w-full min-w-72 cursor-pointer flex-col items-center justify-center rounded-lg bg-transparent px-2 py-6 transition-colors',
          {
            'text-muted-foreground cursor-not-allowed': isPending,
            'hover:bg-accent dark:hover:bg-accent/40': !isPending,
            'opacity-0': isDragActive,
          }
        )}
        htmlFor={_id || id}
      >
        <div className="my-2">
          {isPending ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <Upload className="size-6" />
          )}
        </div>

        <div className="mt-3 space-y-1 text-center">
          <p className="text-sm font-semibold">Drag and drop files here</p>

          <p className="text-muted-foreground max-w-64 text-xs">
            {typeof description === 'string' ? (
              description
            ) : (
              <>
                {description?.maxFiles &&
                  `You can upload ${description.maxFiles} file${description.maxFiles !== 1 ? 's' : ''}.`}
                {' '}
                {description?.maxFileSize &&
                  `${description.maxFiles !== 1 ? 'Each u' : 'U'}p to ${description.maxFileSize}.`}
                {' '}
                {description?.fileTypes && `Accepted ${description.fileTypes}.`}
              </>
            )}
          </p>
        </div>

        <input
          {...getInputProps()}
          type="file"
          multiple={typeof description === 'object' ? (description?.maxFiles || 1) > 1 : false}
          id={_id || id}
          accept={accept}
          disabled={isPending}
        />
      </label>

      {isDragActive && (
        <div className="pointer-events-none absolute inset-0 rounded-lg">
          <div className="dark:bg-accent/40 bg-accent flex size-full flex-col items-center justify-center rounded-lg">
            <div className="my-2">
              <Upload className="size-6" />
            </div>

            <p className="mt-3 text-sm font-semibold">Drop files here</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to parse file size strings like "500KB", "2MB", etc.
function parseFileSize(sizeStr: string): number {
  const units: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  }

  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i)
  if (!match) return 0

  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()

  return value * (units[unit] || 1)
}

