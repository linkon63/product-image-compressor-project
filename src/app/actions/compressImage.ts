'use server';

import sharp from 'sharp';
import { prisma } from '@/lib/prisma';

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
    const userId = formData.get('userId') as string | null;

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
      .toBuffer();

    const compressedSize = compressedBuffer.length;

    // Convert to Base64
    const base64Image = `data:image/webp;base64,${compressedBuffer.toString('base64')}`;

    // Save to database if userId is provided
    if (userId) {
      try {
        const compressionRatio = Math.round(
          ((originalSize - compressedSize) / originalSize) * 100
        );

        await prisma.compressedImage.create({
          data: {
            userId,
            originalName: file.name,
            originalSize,
            compressedSize,
            compressionRatio,
            quality,
            imageData: base64Image,
          },
        });
      } catch (dbError) {
        console.error('Failed to save to database:', dbError);
        // Continue even if DB save fails
      }
    }

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

