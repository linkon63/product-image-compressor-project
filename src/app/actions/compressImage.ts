'use server';

import sharp from 'sharp';

export interface CompressImageResult {
  success: boolean;
  compressedImage?: string; // Base64 string
  originalSize?: number;
  compressedSize?: number;
  error?: string;
}

export async function compressImage(
  formData: FormData
): Promise<CompressImageResult> {
  try {
    const file = formData.get('image') as File;
    const quality = parseInt(formData.get('quality') as string, 10);

    if (!file) {
      return {
        success: false,
        error: 'No image file provided',
      };
    }

    if (!quality || quality < 1 || quality > 100) {
      return {
        success: false,
        error: 'Quality must be between 1 and 100',
      };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalSize = buffer.length;

    // Process image with Sharp
    const compressedBuffer = await sharp(buffer)
      .webp({ quality }) // Convert to WebP with specified quality
      .withMetadata(false) // Strip metadata
      .toBuffer();

    const compressedSize = compressedBuffer.length;

    // Convert to Base64
    const base64Image = `data:image/webp;base64,${compressedBuffer.toString('base64')}`;

    return {
      success: true,
      compressedImage: base64Image,
      originalSize,
      compressedSize,
    };
  } catch (error) {
    console.error('Image compression error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to compress image',
    };
  }
}
