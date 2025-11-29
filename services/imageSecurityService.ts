/**
 * Image Security Service
 * 
 * This service handles client-side sanitization of image uploads.
 * By rendering the user-uploaded file onto an HTML5 Canvas and exporting it
 * as a new Blob/DataURL, we effectively:
 * 1. Strip EXIF metadata (which can contain location data or malicious payloads).
 * 2. Remove appended code (Polyglot images).
 * 3. Neutralize steganographic payloads that rely on specific byte arrangements.
 * 4. Normalize image dimensions and format.
 */

const MAX_DIMENSION = 2048; // Cap resolution to prevent memory exhaustion DoS
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const validateAndSanitizeImage = async (file: File): Promise<string> => {
  // 1. Strict MIME Type Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Security Violation: File type ${file.type} is not allowed. Please upload JPG, PNG, or WebP.`);
  }

  // 2. File Size Check (Client-side DoS prevention)
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Security Violation: File size exceeds ${MAX_SIZE_MB}MB limit.`);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // 3. Aspect Ratio Preservation & Downscaling
      let width = img.width;
      let height = img.height;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      // 4. Canvas Re-encoding (The Sanitization Step)
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('System Error: Could not initialize image processing context.'));
        return;
      }

      // Draw the image. This effectively reads only the pixel data, discarding any 
      // scripts, metadata, or appended binaries hidden in the original file structure.
      ctx.drawImage(img, 0, 0, width, height);

      // 5. Export as clean JPEG
      // forcing image/jpeg eliminates alpha channel vulnerabilities and script embedding capabilities of other formats
      const cleanBase64 = canvas.toDataURL('image/jpeg', 0.85);
      
      resolve(cleanBase64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Security Violation: Malformed image file detected.'));
    };

    img.src = objectUrl;
  });
};
