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
  upscaleFactor?: number;
}

export async function processImageFile(
  file: File | string, // Blob URL or File
  options: ConversionOptions
): Promise<Blob> {
  const { targetFormat, quality, resizeWidth, resizeHeight, watermarkText, upscaleFactor } = options;

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
      
      if (upscaleFactor && upscaleFactor > 1) {
        finalWidth = img.width * upscaleFactor;
        finalHeight = img.height * upscaleFactor;
      } else {
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
      }
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
      
      // Use better interpolation for upscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

      // Apply Enhancement (Sharpening) if upscaled
      if (upscaleFactor && upscaleFactor > 1) {
          const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
          const sharpened = sharpen(imageData, finalWidth, finalHeight);
          ctx.putImageData(sharpened, 0, 0);
      }
      
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

function sharpen(imageData: ImageData, w: number, h: number): ImageData {
    const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const src = imageData.data;
    const sw = w;
    const sh = h;
    const output = new ImageData(w, h);
    const dst = output.data;

    for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
            const sy = y;
            const sx = x;
            const dstOff = (y * sw + x) * 4;
            let r = 0, g = 0, b = 0;

            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = sy + cy - halfSide;
                    const scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        const srcOff = (scy * sw + scx) * 4;
                        const wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff + 1] * wt;
                        b += src[srcOff + 2] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = src[dstOff + 3];
        }
    }
    return output;
}
