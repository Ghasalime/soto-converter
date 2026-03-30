import heic2any from 'heic2any';
import gifshot from 'gifshot';
import ImageTracer from 'imagetracerjs';

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif' | 'image/bmp' | 'image/svg+xml';

export interface ConversionOptions {
  targetFormat: ImageFormat;
  quality: number;
  resizeWidth?: string;
  resizeHeight?: string;
  watermarkText?: string;
}

export async function processImageFile(
  file: File | string, // Blob URL or File
  options: ConversionOptions
): Promise<Blob> {
  const { targetFormat, quality, resizeWidth, resizeHeight, watermarkText } = options;

  let sourceFile = file;
  
  // Handle HEIC/HEIF files
  if (file instanceof File && (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif'))) {
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
    const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
    sourceFile = new File([convertedBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      let finalWidth = img.width;
      let finalHeight = img.height;
      
      const rW = resizeWidth ? parseInt(resizeWidth) : 0;
      const rH = resizeHeight ? parseInt(resizeHeight) : 0;
      
      if (rW && !rH) {
         finalWidth = rW;
         finalHeight = (img.height / img.width) * rW;
      } else if (!rW && rH) {
         finalHeight = rH;
         finalWidth = (img.width / img.height) * rH;
      } else if (rW && rH) {
         finalWidth = rW;
         finalHeight = rH;
      }
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
      }
      
      if (targetFormat === 'image/svg+xml') {
        // Vectorize using ImageTracer
        ImageTracer.imageToSVG(img.src, (svgString: string) => {
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          resolve(blob);
        }, { ltres: 1, qtres: 1, pathomit: 8 });
        return;
      }

      if (targetFormat === 'image/gif') {
        // Create GIF from single image
        gifshot.createGIF({
          images: [img.src],
          interval: 0.1,
          numFrames: 1,
          gifWidth: finalWidth,
          gifHeight: finalHeight
        }, (obj: any) => {
          if (!obj.error) {
            fetch(obj.image).then(res => res.blob()).then(resolve);
          } else {
            reject(new Error(obj.errorMsg));
          }
        });
        return;
      }

      const isNonAlpha = targetFormat === 'image/jpeg' || targetFormat === 'image/bmp';
      if (isNonAlpha) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
      
      if (watermarkText && watermarkText.trim() !== '') {
          const fontSize = Math.max(16, finalWidth * 0.04);
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.fillText(watermarkText, finalWidth - (finalWidth * 0.02), finalHeight - (finalHeight * 0.02));
      }
      
      canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Conversion failed"));
      }, targetFormat, quality);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = typeof sourceFile === 'string' ? sourceFile : URL.createObjectURL(sourceFile);
  });
}
