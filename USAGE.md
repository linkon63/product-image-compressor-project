# Image Compressor - Usage Guide

## 🎯 Quick Start

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## 📖 How to Use the Application

### Step 1: Upload an Image
There are two ways to upload an image:

1. **Drag & Drop:**
   - Drag an image file from your computer
   - Drop it onto the purple dashed zone

2. **Click to Select:**
   - Click anywhere in the upload zone
   - Select an image from the file picker

**Supported Formats:**
- PNG
- JPG/JPEG
- WebP
- GIF

### Step 2: Adjust Quality
Use the quality slider to set the compression level:
- **Lower values (1-50%):** Smaller file size, lower quality
- **Medium values (50-80%):** Balanced size and quality
- **Higher values (80-100%):** Better quality, larger file size

**Recommended Settings:**
- **Web thumbnails:** 40-60%
- **Social media:** 60-80%
- **Professional use:** 80-95%

### Step 3: Compress
Click the **"Compress Image"** button to process your image.

The server will:
1. Convert your image to WebP format
2. Apply the selected quality setting
3. Strip metadata to reduce file size
4. Return the compressed image

### Step 4: Review Results
After compression, you'll see:

**Size Comparison Cards:**
- **Original Size:** Your uploaded file size
- **Compressed Size:** New file size after compression
- **Saved:** Percentage reduction in file size

**Image Comparison:**
- **Left:** Your original image
- **Right:** Compressed WebP image

### Step 5: Download
Click the **"Download Compressed Image"** button to save the compressed image to your computer.

**File Naming:**
- Original: `photo.jpg`
- Downloaded: `compressed-photo.webp`

## 💡 Tips for Best Results

### For Maximum Compression
1. Use quality settings between 60-75%
2. Ideal for web use where some quality loss is acceptable
3. Can achieve 70-90% file size reduction

### For High Quality
1. Use quality settings between 85-95%
2. Minimal visible quality loss
3. Generally achieves 30-50% file size reduction

### Image Type Considerations

**Photographs:**
- Work great with WebP compression
- Recommended quality: 75-85%

**Graphics/Illustrations:**
- May show artifacts at lower quality
- Recommended quality: 85-95%

**Screenshots:**
- Text may become blurry at low quality
- Recommended quality: 80-90%

## 🎨 Understanding the UI

### Color-Coded Statistics
- **Blue Card:** Original file information
- **Green Card:** Compressed file information
- **Purple Card:** Savings percentage

### Interactive Elements
- **Drag Zone:** Changes color when you drag over it
- **Quality Slider:** Real-time adjustment (1-100%)
- **Compress Button:** Disabled until you upload an image
- **Download Button:** Appears after successful compression

## ⚡ Performance Notes

### Processing Time
- Small images (< 1MB): Near instant
- Medium images (1-5MB): 1-3 seconds
- Large images (5-20MB): 3-10 seconds

### File Size Limits
The application can handle images up to:
- **Recommended:** Up to 20MB
- **Maximum:** Limited by server memory and timeout

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🔧 Troubleshooting

### "No image file provided"
**Solution:** Make sure you've uploaded an image before clicking compress.

### "Quality must be between 1 and 100"
**Solution:** The quality slider should automatically enforce this, but if you see this error, try moving the slider again.

### "Failed to compress image"
**Possible causes:**
1. Image file is corrupted
2. Unsupported image format
3. File is too large

**Solution:**
- Try a different image
- Convert to PNG or JPG first
- Resize the image before uploading

### Slow Processing
**If compression takes too long:**
1. Check your image size (resize large images first)
2. Check your internet connection
3. Try refreshing the page

### Download Not Working
**Solutions:**
1. Check browser download settings
2. Ensure pop-ups are not blocked
3. Try a different browser

## 📊 Example Results

### Example 1: Large Photo
- **Original:** 4.2 MB (JPG)
- **Quality Setting:** 75%
- **Compressed:** 890 KB (WebP)
- **Savings:** 79%

### Example 2: Screenshot
- **Original:** 2.1 MB (PNG)
- **Quality Setting:** 85%
- **Compressed:** 780 KB (WebP)
- **Savings:** 63%

### Example 3: Illustration
- **Original:** 1.5 MB (PNG)
- **Quality Setting:** 90%
- **Compressed:** 620 KB (WebP)
- **Savings:** 59%

## 🔐 Privacy & Security

### Your Images Are Safe
- Images are processed in memory
- No images are stored on the server
- Processing happens server-side
- Downloads happen client-side

### Data Handling
1. Upload → Processed in server RAM
2. Compressed → Sent back to browser
3. Download → Saved to your device
4. Server forgets everything

**We never store, log, or transmit your images to third parties.**

## 🚀 Advanced Usage

### Batch Processing
Currently, the app processes one image at a time. For batch processing:
1. Upload and compress first image
2. Download result
3. Upload next image
4. Repeat

### API Usage
If you want to integrate this into your own application, you can use the server action directly:

```typescript
import { compressImage } from '@/app/actions/compressImage';

const formData = new FormData();
formData.append('image', fileObject);
formData.append('quality', '80');

const result = await compressImage(formData);

if (result.success) {
  console.log('Compressed!', result.compressedImage);
}
```

## 📱 Mobile Usage

The application is fully responsive and works on mobile devices:

### Mobile Tips
1. Use the camera to take a photo, then select it
2. Tap the upload zone to choose from gallery
3. Swipe to adjust quality slider
4. Scroll to see full comparison

### Recommended Mobile Quality
- For sharing: 65-75%
- For archiving: 80-90%

## ⌨️ Keyboard Shortcuts

While on the page:
- **Tab:** Navigate between elements
- **Enter:** Trigger focused button
- **Left/Right Arrows:** Adjust slider (when focused)

## 🎓 Learning Resources

### Understanding WebP
- [WebP Overview](https://developers.google.com/speed/webp)
- Modern image format developed by Google
- Better compression than JPG/PNG
- Supports transparency and animation

### Understanding Image Quality
- **Lossless:** No quality degradation (100%)
- **Lossy:** Some quality loss for smaller size
- **Perceptual Quality:** What humans actually notice

### Sharp Library
- High-performance Node.js image processing
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- C++ binding to libvips

## 🆘 Need Help?

If you encounter any issues:
1. Check this guide first
2. Review the README.md
3. Check the browser console for errors
4. Open an issue on GitHub (if applicable)

---

**Happy Compressing! 🎉**
