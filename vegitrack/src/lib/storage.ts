import { supabase } from './supabase'

const BUCKET_NAME = 'images'
const MAX_FILE_SIZE = 500 * 1024 // 500KB in bytes

/**
 * Validates file size on client side
 */
export function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    const fileSizeKB = (file.size / 1024).toFixed(2)
    const maxSizeKB = (MAX_FILE_SIZE / 1024).toFixed(0)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `Image is too large! Maximum size is ${maxSizeKB}KB, but your file is ${fileSizeKB}KB (${fileSizeMB}MB). Please compress or resize the image before uploading.`,
    }
  }
  return { valid: true }
}

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param path - The path in the bucket (e.g., 'farms/farm-123.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadImageToStorage(
  file: File,
  path: string
): Promise<string> {
  // Validate file size
  const validation = validateFileSize(file)
  if (!validation.valid) {
    throw new Error(validation.error || 'File size validation failed')
  }

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      contentType: file.type,
      upsert: true, // Overwrite if file exists
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  if (!urlData?.publicUrl) {
    throw new Error('Failed to get public URL for uploaded image')
  }

  return urlData.publicUrl
}

/**
 * Generates a unique file path for a farm image
 */
export function generateFarmImagePath(farmId: string, fileName: string): string {
  const timestamp = Date.now()
  const extension = fileName.split('.').pop() || 'jpg'
  return `farms/${farmId}-${timestamp}.${extension}`
}

/**
 * Generates a unique file path for a product image
 */
export function generateProductImagePath(productId: string, fileName: string): string {
  const timestamp = Date.now()
  const extension = fileName.split('.').pop() || 'jpg'
  return `products/${productId}-${timestamp}.${extension}`
}

