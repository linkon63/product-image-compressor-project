# 🖼️ Image Compressor - Next.js App

A modern, high-performance image compression web application built with Next.js 15 (App Router), Sharp, and React Dropzone. Convert and compress images to WebP format with adjustable quality settings.

![Image Compressor](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🎯 **Drag & Drop Interface** - Easy-to-use drag-and-drop zone powered by react-dropzone
- 🎨 **Premium UI Design** - Glassmorphic design with gradient backgrounds and smooth animations
- ⚡ **Server-Side Processing** - Efficient image compression using Sharp library on the server
- 🔧 **Adjustable Quality** - Interactive slider to control compression quality (1-100%)
- 📊 **Size Comparison** - Real-time display of original vs. compressed file sizes
- 💾 **WebP Conversion** - Automatic conversion to modern WebP format
- 🗑️ **Metadata Stripping** - Removes unnecessary metadata to reduce file size
- 📥 **One-Click Download** - Download compressed images instantly
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Project Structure

```
softzino-image-compressor/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── compressImage.ts      # Server Action for image compression
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.tsx                  # Main page component
│   │   └── globals.css               # Global styles
│   └── components/
│       └── ImageCompressor.tsx       # Main image compressor component
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── next.config.ts                   # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd softzino-image-compressor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Tech Stack

### Core Technologies
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Key Libraries
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing
- **[react-dropzone](https://react-dropzone.js.org/)** - Drag-and-drop file upload

## 📝 How It Works

### Server Action (`compressImage.ts`)
The server action handles the image compression process:

1. Receives FormData containing the image file and quality setting
2. Converts the file to a Buffer
3. Uses Sharp to:
   - Convert the image to WebP format
   - Apply the specified quality setting
   - Strip metadata
4. Returns a Base64-encoded string of the compressed image along with size statistics

### Client Component (`ImageCompressor.tsx`)
The client component provides the user interface:

1. **Drag & Drop Zone**: Users can drag and drop images or click to select files
2. **Quality Slider**: Adjustable slider (1-100%) to control compression quality
3. **Compress Button**: Triggers the server action to process the image
4. **Results Display**:
   - Side-by-side comparison of original and compressed images
   - File size statistics (original, compressed, savings percentage)
   - Download button for the compressed image

## 🎨 Design Philosophy

The application features a **premium, modern design** with:
- Glassmorphic UI elements with backdrop blur effects
- Vibrant gradient backgrounds (purple, pink, slate)
- Smooth animations and transitions
- Interactive hover effects
- Responsive layout for all screen sizes
- Color-coded statistics cards (blue for original, green for compressed, purple for savings)

## 🔧 Configuration

### Supported Image Formats
- PNG
- JPG/JPEG
- WebP
- GIF

### Quality Range
- Minimum: 1%
- Maximum: 100%
- Default: 80%

### Output Format
- All images are converted to **WebP** format for optimal compression and quality

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Image processing powered by [Sharp](https://sharp.pixelplumbing.com/)
- File upload UI by [react-dropzone](https://react-dropzone.js.org/)

---

**Made with ❤️ using Next.js and Sharp**
# product-image-compressor-project
