# Project Structure Documentation

This document explains the folder structure and file organization of the Image Compressor Next.js application.

## 📁 Root Directory Structure

```
softzino-image-compressor/
├── src/                          # Source code directory
├── public/                       # Static assets
├── node_modules/                 # Dependencies (auto-generated)
├── .next/                        # Next.js build output (auto-generated)
├── .git/                         # Git repository
├── package.json                  # Project dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── eslint.config.mjs            # ESLint configuration
├── next-env.d.ts                # Next.js TypeScript declarations
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

## 📂 Source Directory (`src/`)

### App Directory (`src/app/`)
The Next.js App Router directory containing routes and server-side logic.

```
src/app/
├── actions/                     # Server Actions
│   └── compressImage.ts        # Image compression server action
├── layout.tsx                  # Root layout component
├── page.tsx                    # Home page (main route)
└── globals.css                 # Global CSS styles
```

#### `actions/compressImage.ts`
**Purpose:** Server-side image compression logic using the Sharp library.

**Key Features:**
- Accepts FormData with image file and quality parameter
- Converts images to WebP format
- Adjusts quality based on user input
- Strips metadata to reduce file size
- Returns Base64-encoded compressed image
- Provides size comparison data

**Interface:**
```typescript
export interface CompressImageResult {
  success: boolean;
  compressedImage?: string;      // Base64 string
  originalSize?: number;          // Bytes
  compressedSize?: number;        // Bytes
  error?: string;
}

export async function compressImage(formData: FormData): Promise<CompressImageResult>
```

#### `layout.tsx`
**Purpose:** Root layout wrapper for the entire application.

**Features:**
- Defines HTML structure
- Sets up Font loading (Geist Sans, Geist Mono)
- Contains metadata for SEO
- Wraps all pages with consistent layout

#### `page.tsx`
**Purpose:** Main landing page of the application.

**Implementation:**
```typescript
import ImageCompressor from '@/components/ImageCompressor';

export default function Home() {
  return <ImageCompressor />;
}
```

#### `globals.css`
**Purpose:** Global styles and Tailwind CSS directives.

### Components Directory (`src/components/`)

```
src/components/
└── ImageCompressor.tsx         # Main image compressor component
```

#### `ImageCompressor.tsx`
**Purpose:** Client-side interactive component for image compression UI.

**Key Features:**
- Drag-and-drop file upload zone (react-dropzone)
- Image preview (original and compressed)
- Quality adjustment slider (1-100%)
- Compress button with loading state
- Size comparison display
- Download functionality
- Error handling and user feedback
- Premium glassmorphic UI design

**State Management:**
```typescript
const [originalFile, setOriginalFile] = useState<File | null>(null);
const [originalPreview, setOriginalPreview] = useState<string>('');
const [compressedImage, setCompressedImage] = useState<string>('');
const [quality, setQuality] = useState<number>(80);
const [originalSize, setOriginalSize] = useState<number>(0);
const [compressedSize, setCompressedSize] = useState<number>(0);
const [isProcessing, setIsProcessing] = useState<boolean>(false);
const [error, setError] = useState<string>('');
```

## 🎨 Styling Architecture

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configurations:

- **Utility-first approach:** Classes like `bg-gradient-to-br`, `rounded-3xl`, `backdrop-blur-lg`
- **Responsive design:** Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Custom gradients:** Purple, pink, and slate color scheme
- **Glass morphism:** Uses `backdrop-blur` and transparency

### Custom Styles
Located in `ImageCompressor.tsx` using styled-jsx for:
- Custom range slider styling
- Hover effects on slider thumb
- Cross-browser compatibility (WebKit, Mozilla)

## 🔧 Configuration Files

### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};
```
- Sets Turbopack root directory to fix workspace detection
- Can be extended with additional Next.js options

### `tsconfig.json`
TypeScript configuration with:
- Strict type checking
- Path aliases (`@/*` → `src/*`)
- Next.js specific compiler options

### `tailwind.config.ts`
Tailwind CSS configuration for:
- Content paths (which files to scan)
- Custom theme extensions
- Plugin configurations

## 📦 Dependencies

### Production Dependencies
```json
{
  "next": "^16.1.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-dropzone": "^14.3.5",
  "sharp": "^0.33.5"
}
```

### Development Dependencies
```json
{
  "@tailwindcss/postcss": "^4.0.0",
  "@types/node": "^22.10.5",
  "@types/react": "^19.0.6",
  "@types/react-dom": "^19.0.2",
  "eslint": "^9.17.0",
  "eslint-config-next": "^16.1.1",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.7.2"
}
```

## 🚀 Build Process

### Development
```bash
npm run dev
```
- Starts Next.js development server with Turbopack
- Hot Module Replacement (HMR) enabled
- Runs on http://localhost:3000

### Production
```bash
npm run build
npm start
```
- Creates optimized production build
- Generates static pages and server functions
- Starts production server

## 🔄 Data Flow

1. **User uploads image** → Drag & Drop zone or File selector
2. **Client creates preview** → FileReader converts to Data URL
3. **User adjusts quality** → Slider updates state (1-100%)
4. **User clicks compress** → Triggers server action
5. **FormData created** → Contains image file + quality
6. **Server processes** → Sharp compresses, converts to WebP
7. **Base64 returned** → Compressed image sent back to client
8. **UI updates** → Shows comparison and download option

## 🎯 Key Design Patterns

### Server Actions
- Uses Next.js 15 Server Actions (`'use server'`)
- Keeps server-side logic separate from client
- Type-safe with TypeScript interfaces

### Client Components
- Marked with `'use client'` directive
- Handles interactivity and state
- Communicates with server actions via FormData

### Separation of Concerns
- **Server Actions:** Business logic and data processing
- **Components:** UI and user interaction
- **Styles:** Presentation layer

## 🔒 Security Considerations

- File type validation (accepts only image formats)
- Quality range validation (1-100)
- Error handling for invalid inputs
- Server-side processing prevents client manipulation
- No storage of uploaded images (processed in memory)

## 📱 Responsive Design

The application is fully responsive with:
- Mobile: Single column layout
- Tablet: Adaptive grid layouts
- Desktop: Full side-by-side comparison

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

## 🎨 Color Scheme

- **Primary Gradient:** Purple (#a855f7) → Pink (#ec4899)
- **Background:** Slate-900 → Purple-900 → Slate-900
- **Accents:**
  - Blue: Original size indicator
  - Green: Compressed size indicator
  - Purple: Savings indicator
  - Red: Error messages

## 📝 Best Practices Implemented

1. **TypeScript:** Full type safety throughout
2. **Server Components:** Default, only client where needed
3. **Code Splitting:** Automatic with Next.js
4. **Image Optimization:** WebP format for best compression
5. **Error Handling:** User-friendly error messages
6. **Loading States:** Visual feedback during processing
7. **Accessibility:** Semantic HTML and proper ARIA attributes
8. **SEO:** Proper metadata and description
9. **Performance:** Server-side processing, optimized builds
10. **Modern UI:** Glassmorphism, gradients, animations

---

This structure is designed for:
- **Maintainability:** Clear separation of concerns
- **Scalability:** Easy to add new features
- **Performance:** Optimized builds and server actions
- **Developer Experience:** TypeScript, ESLint, hot reload
