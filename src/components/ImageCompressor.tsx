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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🐼</div>
              <h1 className="text-2xl font-bold text-gray-800">
                Image<span className="text-emerald-600">Compressor</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">Developer API</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart WebP, PNG and JPEG Compression
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Optimize your images with a perfect balance between quality and file size.
          </p>
          <p className="text-gray-500">
            Use the online tool or learn more about the Developer API.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        {!compressedImage ? (
          <div className="mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-emerald-500 bg-emerald-50'
                  : originalFile
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                {!originalFile ? (
                  <>
                    <div className="text-6xl mb-2">📁</div>
                    <p className="text-xl font-semibold text-gray-700">
                      {isDragActive ? 'Drop your image here!' : 'Drop your image here!'}
                    </p>
                    <p className="text-sm text-gray-500">
                      or click to select • PNG, JPG, JPEG, WebP, GIF up to 5MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-2">✓</div>
                    <p className="text-lg font-semibold text-emerald-700">
                      {originalFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(originalSize)} • Click to choose a different file
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quality Slider */}
            {originalFile && (
              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-base font-semibold text-gray-700">
                    Compression Quality
                  </label>
                  <span className="text-2xl font-bold text-emerald-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer tinypng-slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            {/* Compress Button */}
            {originalFile && (
              <div className="mt-6">
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-lg"
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
                      Compressing...
                    </span>
                  ) : (
                    'Compress Image'
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                <p className="font-medium">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6">
            {/* Success Message */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                Compression Complete!
              </h3>
              <p className="text-emerald-700">
                Your image has been optimized and is ready to download.
              </p>
            </div>

            {/* Size Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Original Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatFileSize(originalSize)}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <p className="text-sm text-emerald-700 mb-1">Compressed Size</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {formatFileSize(compressedSize)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Size Reduction</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {compressionRatio}%
                </p>
              </div>
            </div>

            {/* Image Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Original</h3>
                  <span className="text-xs text-gray-500">{formatFileSize(originalSize)}</span>
                </div>
                <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={originalPreview}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed Image */}
              <div className="bg-white border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-emerald-700">Compressed (WebP)</h3>
                  <span className="text-xs text-emerald-600">{formatFileSize(compressedSize)}</span>
                </div>
                <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 bg-emerald-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
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
                <span>Download</span>
              </button>
              <button
                onClick={() => {
                  setOriginalFile(null);
                  setOriginalPreview('');
                  setCompressedImage('');
                  setCompressedSize(0);
                  setQuality(80);
                }}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Compress Another Image
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What does this compressor do?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Compression</h4>
              <p className="text-sm text-gray-600">
                Uses intelligent algorithms to reduce file sizes while preserving image quality.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-2">WebP Format</h4>
              <p className="text-sm text-gray-600">
                Converts images to modern WebP format for optimal compression and quality.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600">
                Images are processed in memory. No files are stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>Built with Next.js, Sharp, and React Dropzone</p>
        </div>
      </footer>

      <style jsx>{`
        .tinypng-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #059669;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .tinypng-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #047857;
        }

        .tinypng-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #059669;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .tinypng-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          background: #047857;
        }

        .tinypng-slider::-webkit-slider-runnable-track {
          background: linear-gradient(
            to right,
            #059669 0%,
            #059669 ${quality}%,
            #e5e7eb ${quality}%,
            #e5e7eb 100%
          );
        }
      `}</style>
    </div>
  );
}
