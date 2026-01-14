'use server';

import { prisma } from '@/lib/prisma';

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    profilePicture: string | null;
  };
  error?: string;
}

export async function loginWithEmail(email: string): Promise<AuthResult> {
  try {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Please provide a valid email address',
      };
    }

    // Find or create user with this email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: { email },
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Failed to log in',
    };
  }
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    phone?: string;
    profilePicture?: string;
  }
): Promise<AuthResult> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}

export async function getUserStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        compressedImages: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const totalImages = user.compressedImages.length;
    const totalOriginalSize = user.compressedImages.reduce(
      (sum, img) => sum + img.originalSize,
      0
    );
    const totalCompressedSize = user.compressedImages.reduce(
      (sum, img) => sum + img.compressedSize,
      0
    );
    const totalSaved = totalOriginalSize - totalCompressedSize;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
      stats: {
        totalImages,
        totalOriginalSize,
        totalCompressedSize,
        totalSaved,
        averageCompressionRatio: totalImages > 0
          ? Math.round((totalSaved / totalOriginalSize) * 100)
          : 0,
      },
      recentImages: user.compressedImages.slice(0, 10).map((img) => ({
        id: img.id,
        originalName: img.originalName,
        originalSize: img.originalSize,
        compressedSize: img.compressedSize,
        compressionRatio: img.compressionRatio,
        quality: img.quality,
        createdAt: img.createdAt.toISOString(),
        imageData: img.imageData,
      })),
    };
  } catch (error) {
    console.error('Get user stats error:', error);
    return {
      success: false,
      error: 'Failed to get user stats',
    };
  }
}
