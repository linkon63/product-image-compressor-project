# Image Compressor - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           🌐 BROWSER (Client)                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │         ImageCompressor Component (Client Component)        │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │                                                              │    │
│  │  📁 Drag & Drop Zone                                        │    │
│  │     • react-dropzone                                        │    │
│  │     • File validation (PNG, JPG, WebP, GIF)                │    │
│  │                                                              │    │
│  │  🎚️  Quality Slider                                         │    │
│  │     • Range: 1-100%                                         │    │
│  │     • Default: 80%                                          │    │
│  │                                                              │    │
│  │  🖼️  Image Preview                                          │    │
│  │     • Original image display                                │    │
│  │     • Compressed image display                              │    │
│  │                                                              │    │
│  │  📊 Size Comparison                                         │    │
│  │     • Original size                                         │    │
│  │     • Compressed size                                       │    │
│  │     • Savings percentage                                    │    │
│  │                                                              │    │
│  │  💾 Download Button                                         │    │
│  │     • One-click download                                    │    │
│  │     • WebP format output                                    │    │
│  │                                                              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │  📤 UPLOAD
                               │  FormData {
                               │    image: File
                               │    quality: number
                               │  }
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ⚙️  Next.js Server (Backend)                    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │        Server Action: compressImage()                       │    │
│  │  file: /src/app/actions/compressImage.ts                   │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │                                                              │    │
│  │  1️⃣  Receive & Validate                                     │    │
│  │     • Extract image file from FormData                      │    │
│  │     • Extract quality parameter                             │    │
│  │     • Validate inputs (file exists, quality 1-100)         │    │
│  │                                                              │    │
│  │  2️⃣  Convert to Buffer                                      │    │
│  │     • arrayBuffer() → Buffer                                │    │
│  │     • Get original file size                                │    │
│  │                                                              │    │
│  └────────────────────┬───────────────────────────────────────┘    │
│                       │                                             │
│                       ▼                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │             📸 Sharp Image Processing                       │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │                                                              │    │
│  │  sharp(buffer)                                              │    │
│  │    .webp({ quality })    ← Convert to WebP format          │    │
│  │    .withMetadata(false)  ← Strip EXIF/metadata             │    │
│  │    .toBuffer()           ← Get compressed buffer           │    │
│  │                                                              │    │
│  └────────────────────┬───────────────────────────────────────┘    │
│                       │                                             │
│                       ▼                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │          3️⃣  Encode & Prepare Response                      │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │                                                              │    │
│  │  • Get compressed file size                                 │    │
│  │  • Convert buffer to Base64                                 │    │
│  │  • Create data URL: data:image/webp;base64,...             │    │
│  │  • Calculate compression ratio                              │    │
│  │  • Return CompressImageResult object                        │    │
│  │                                                              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               │  📥 RESPONSE
                               │  CompressImageResult {
                               │    success: true
                               │    compressedImage: "data:image/webp;base64,..."
                               │    originalSize: 2048000
                               │    compressedSize: 512000
                               │  }
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       🌐 BROWSER (Client)                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              UI Update & Display Results                    │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │                                                              │    │
│  │  ✅ Update State                                            │    │
│  │     • setCompressedImage(base64)                            │    │
│  │     • setCompressedSize(size)                               │    │
│  │     • Calculate savings %                                   │    │
│  │                                                              │    │
│  │  🎨 Render Comparison                                       │    │
│  │     • Show original image (left)                            │    │
│  │     • Show compressed image (right)                         │    │
│  │     • Display size cards (blue/green/purple)               │    │
│  │                                                              │    │
│  │  💾 Enable Download                                         │    │
│  │     • Create download link                                  │    │
│  │     • Set filename: compressed-{original}.webp              │    │
│  │     • Click to download                                     │    │
│  │                                                              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Summary

### Phase 1: Upload & Input
1. User drags/selects image → File object created
2. File preview generated using FileReader
3. User adjusts quality slider → State updated (1-100)
4. User clicks "Compress Image" button

### Phase 2: Client → Server
5. FormData created with:
   - `image`: File object
   - `quality`: number
6. Server Action `compressImage()` called
7. Data sent to Next.js backend

### Phase 3: Server Processing
8. Server receives FormData
9. Extract and validate inputs
10. Convert File to Buffer
11. Sharp processes the image:
    - Convert format → WebP
    - Apply quality setting
    - Strip metadata
12. Get compressed buffer size
13. Encode to Base64 string
14. Create response object

### Phase 4: Server → Client
15. Return CompressImageResult to client
16. Client receives response object

### Phase 5: Display Results
17. Update React state with compressed image
18. Render side-by-side comparison
19. Show size statistics
20. Enable download button
21. User downloads compressed image

---

## 🏗️ Technology Stack by Layer

### Client Layer (Browser)
- **Framework:** React 19
- **Language:** TypeScript
- **File Upload:** react-dropzone
- **State Management:** React useState hooks
- **Styling:** Tailwind CSS + custom CSS

### Server Layer (Backend)
- **Runtime:** Node.js
- **Framework:** Next.js 16 (App Router)
- **Image Processing:** Sharp library
- **Architecture:** Server Actions

### Build Layer
- **Bundler:** Turbopack (Next.js)
- **Compiler:** TypeScript
- **Linter:** ESLint
- **Package Manager:** npm

---

## 📦 File Organization

```
src/
├── app/
│   ├── actions/
│   │   └── compressImage.ts       ← Server Action (Backend Logic)
│   ├── layout.tsx                 ← Root Layout + Metadata
│   ├── page.tsx                   ← Home Page (renders ImageCompressor)
│   └── globals.css                ← Global Styles
└── components/
    └── ImageCompressor.tsx        ← Main UI Component (Frontend)
```

---

## ⚡ Performance Optimizations

### Client-Side
- ✅ **Lazy Loading:** Only render compressed view after processing
- ✅ **State Management:** Efficient React state updates
- ✅ **Debouncing:** Quality slider updates without re-compression
- ✅ **Code Splitting:** Automatic with Next.js

### Server-Side
- ✅ **In-Memory Processing:** No file system I/O
- ✅ **Sharp Performance:** C++ bindings for fast processing
- ✅ **Buffer Management:** Efficient memory handling
- ✅ **No Storage:** Images processed and discarded

### Network
- ✅ **Base64 Encoding:** Single response payload
- ✅ **Server Actions:** Automatic API route generation
- ✅ **Type Safety:** Reduced runtime errors

---

## 🔒 Security Features

### Input Validation
- ✅ File type validation (image/* only)
- ✅ Quality range validation (1-100)
- ✅ File existence checking
- ✅ Error handling for invalid inputs

### Data Privacy
- ✅ No server-side storage
- ✅ In-memory processing only  
- ✅ No logging of image data
- ✅ No third-party transmission

### Server Security
- ✅ Server-side processing prevents client manipulation
- ✅ Type-safe interfaces
- ✅ Error boundaries

---

## 🎨 UI/UX Features

### Visual Feedback
- Loading spinner during processing
- Disabled button states
- Error messages
- Success indicators
- Size comparison cards

### Interactions
- Drag-and-drop highlighting
- Hover effects
- Smooth transitions
- Responsive layout
- Touch-friendly controls

### Design System
- Glassmorphic containers
- Gradient backgrounds
- Custom slider styling
- Color-coded statistics
- Premium aesthetics

---

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Type-safe data flow
- ✅ Efficient processing
- ✅ Great user experience
- ✅ Scalable structure
