'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '@/app/actions/compressImage';

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedImage, setCompressedImage] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setOriginalFile(file);
      setOriginalSize(file.size);
      setError('');
      setCompressedImage('');
      setCompressedSize(0);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxFiles: 1,
  });

  const handleCompress = async () => {
    if (!originalFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', originalFile);
      formData.append('quality', quality.toString());

      const result = await compressImage(formData);

      if (result.success && result.compressedImage) {
        setCompressedImage(result.compressedImage);
        setCompressedSize(result.compressedSize || 0);
      } else {
        setError(result.error || 'Failed to compress image');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-${originalFile?.name.replace(/\.[^/.]+$/, '')}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const compressionRatio = originalSize && compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Image Compressor
          </h1>
          <p className="text-xl text-gray-300">
            Compress your images to WebP format with adjustable quality
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Drag and Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-3 border-dashed rounded-2xl p-12 mb-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-purple-400 bg-purple-500/20 scale-105'
                : 'border-gray-400 bg-white/5 hover:bg-white/10 hover:border-purple-300'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-4">
              <svg
                className={`w-20 h-20 ${isDragActive ? 'text-purple-400' : 'text-gray-400'} transition-colors`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {isDragActive ? (
                <p className="text-xl font-semibold text-purple-300">
                  Drop the image here...
                </p>
              ) : (
                <>
                  <p className="text-xl font-semibold text-gray-200">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports PNG, JPG, JPEG, WebP, GIF
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Quality Slider */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-white mb-4">
              Quality: {quality}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${quality}%, rgb(55, 65, 81) ${quality}%, rgb(55, 65, 81) 100%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Lower size</span>
              <span>Higher quality</span>
            </div>
          </div>

          {/* Compress Button */}
          <button
            onClick={handleCompress}
            disabled={!originalFile || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl mb-8"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Compress Image'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-xl mb-8">
              <p className="font-semibold">Error: {error}</p>
            </div>
          )}

          {/* Results Section */}
          {compressedImage && (
            <div className="space-y-8">
              {/* Size Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
                  <h3 className="text-sm font-semibold text-blue-300 mb-2">
                    Original Size
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {formatFileSize(originalSize)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                  <h3 className="text-sm font-semibold text-green-300 mb-2">
                    Compressed Size
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {formatFileSize(compressedSize)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-sm font-semibold text-purple-300 mb-2">
                    Saved
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {compressionRatio}%
                  </p>
                </div>
              </div>

              {/* Image Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Original
                  </h3>
                  <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
                    <img
                      src={originalPreview}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Compressed Image */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Compressed (WebP)
                  </h3>
                  <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
                    <img
                      src={compressedImage}
                      alt="Compressed"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download Compressed Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400">
            Built with Next.js, Sharp, and React Dropzone
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(168, 85, 247, 0.7);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
          transition: all 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}
