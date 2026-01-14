# Quick Reference - Image Compressor

Quick commands and references for the Image Compressor project.

---

## 🚀 Quick Start Commands

### Development
```bash
# Start development server
npm run dev

# Access the app
open http://localhost:3000
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📂 Key File Locations

### Source Files
```
src/app/actions/compressImage.ts    # Server Action - Image processing
src/components/ImageCompressor.tsx  # Main UI component
src/app/page.tsx                    # Home page
src/app/layout.tsx                  # Root layout + metadata
```

### Configuration
```
next.config.ts        # Next.js configuration
tsconfig.json         # TypeScript config
tailwind.config.ts    # Tailwind CSS config
package.json          # Dependencies
```

### Documentation
```
README.md             # Main documentation
USAGE.md              # User guide
STRUCTURE.md          # Project structure
ARCHITECTURE.md       # Architecture diagram
CHANGELOG.md          # Version history
PROJECT_SUMMARY.md    # Project summary
```

---

## 🛠️ Common Development Tasks

### Adding a New Feature

1. **Create component:**
```bash
touch src/components/NewComponent.tsx
```

2. **Import in page:**
```typescript
import NewComponent from '@/components/NewComponent';
```

3. **Use in layout:**
```typescript
<NewComponent />
```

### Modifying Compression Settings

Edit: `src/app/actions/compressImage.ts`

```typescript
// Change WebP quality
.webp({ quality })

// Try different formats
.jpeg({ quality })
.png({ quality })
.avif({ quality })
```

### Changing UI Colors

Edit: `src/components/ImageCompressor.tsx`

```typescript
// Main gradient background
className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"

// Button gradient
className="bg-gradient-to-r from-purple-600 to-pink-600"
```

### Adjusting Quality Range

Edit: `src/components/ImageCompressor.tsx`

```typescript
// Default quality
const [quality, setQuality] = useState<number>(80);

// Slider range
<input type="range" min="1" max="100" />
```

---

## 📦 Dependency Management

### Install New Dependency
```bash
npm install package-name
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm update package-name
```

### Remove Dependency
```bash
npm uninstall package-name
```

---

## 🐛 Debugging

### Check Logs
```bash
# Development logs are in the terminal running 'npm run dev'
# Look for:
# - Compilation errors
# - Runtime errors
# - Server action errors
```

### Browser Console
```javascript
// In ImageCompressor.tsx, add:
console.log('Original file:', originalFile);
console.log('Quality:', quality);
console.log('Result:', result);
```

### Server Logs
```typescript
// In compressImage.ts, add:
console.log('Received file:', file.name);
console.log('Quality:', quality);
console.error('Compression error:', error);
```

---

## 🔧 Configuration Tweaks

### Increase Upload Size Limit
Create `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust as needed
    },
  },
};
```

### Add Custom Font
Edit `src/app/layout.tsx`:
```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

### Modify Metadata
Edit `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Your Title",
  description: "Your description",
};
```

---

## 📊 Performance Monitoring

### Build Analysis
```bash
# Analyze bundle size
npm run build

# Check output
ls -lh .next/static/chunks/
```

### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

---

## 🚨 Troubleshooting Quick Fixes

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Reset Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
rm -rf .next
rm tsconfig.tsbuildinfo
npx tsc --noEmit
```

---

## 🎨 UI Customization Quick Edits

### Change Main Gradient
```typescript
// From purple/pink to blue/green
className="bg-gradient-to-br from-blue-900 via-teal-900 to-blue-900"
```

### Adjust Padding/Spacing
```typescript
// More compact
className="p-4 mb-4"

// More spacious
className="p-12 mb-12"
```

### Border Radius
```typescript
// More rounded
className="rounded-3xl"

// Less rounded
className="rounded-xl"
```

---

## 📸 Testing Image Compression

### Test Images
```bash
# Create test images directory
mkdir test-images

# Add various image types:
# - Large photo (5MB+)
# - Small icon (< 100KB)
# - Screenshot (1-2MB)
# - Transparent PNG
# - Animated GIF
```

### Quality Tests
- **Quality 50:** Maximum compression
- **Quality 70:** Balanced
- **Quality 85:** High quality
- **Quality 95:** Minimal loss

---

## 🔐 Environment Variables (Future)

Create `.env.local`:
```bash
# Example for future features
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
NEXT_PUBLIC_DEFAULT_QUALITY=80
NEXT_PUBLIC_ALLOWED_FORMATS=png,jpg,jpeg,webp,gif
```

Access in code:
```typescript
const maxSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE;
```

---

## 📱 Mobile Testing

### Using Safari (iOS)
```bash
# Get local IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Access from iPhone/iPad
http://YOUR_IP:3000
```

### Using Chrome (Android)
```bash
# Same as above
adb reverse tcp:3000 tcp:3000  # If using emulator
```

---

## 🚀 Deployment Quick Guide

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

### Docker (Self-hosting)
```dockerfile
# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t image-compressor .
docker run -p 3000:3000 image-compressor
```

---

## 📚 Useful Documentation Links

### Official Docs
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Sharp](https://sharp.pixelplumbing.com/)
- [react-dropzone](https://react-dropzone.js.org/)

### Guides
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Sharp Image Formats](https://sharp.pixelplumbing.com/api-output)
- [WebP Format](https://developers.google.com/speed/webp)

---

## ⌨️ VSCode Shortcuts (Recommended)

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 🎯 Common Use Cases

### Scenario 1: Reduce Website Image Size
```
Quality: 70-80%
Input: JPG/PNG photos
Output: WebP
Typical Reduction: 60-70%
```

### Scenario 2: Optimize for Social Media
```
Quality: 75-85%
Input: Any format
Output: WebP
Typical Reduction: 50-60%
```

### Scenario 3: Archive Photos
```
Quality: 85-95%
Input: High-res photos
Output: WebP
Typical Reduction: 30-40%
```

---

## 🔄 Git Workflow

### Initial Commit
```bash
git add .
git commit -m "Initial commit: Image Compressor app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Feature Branch
```bash
git checkout -b feature/batch-processing
# Make changes
git add .
git commit -m "Add batch processing feature"
git push origin feature/batch-processing
```

---

## 📞 Quick Help

- **Documentation:** Check `/README.md`
- **Usage Guide:** Check `/USAGE.md`
- **Architecture:** Check `/ARCHITECTURE.md`
- **Structure:** Check `/STRUCTURE.md`

---

**Last Updated:** January 13, 2026
**Version:** 1.0.0
