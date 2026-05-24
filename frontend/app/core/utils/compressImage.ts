/**
 * Compress an image file client-side using HTML Canvas.
 * This also automatically strips all EXIF metadata (GPS coordinates, camera model, etc.)
 * by drawing the raw pixels onto a canvas.
 * 
 * It converts JPEG/PNG files to highly optimized WebP files.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<File> {
  // Only compress images, ignore other file types (PDF, ZIP, etc.)
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Also skip GIF/SVG as canvas drawing will lose animations/vector properties
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file); // Fallback to original file on failure
        }

        // Draw image onto canvas (this strips all EXIF metadata)
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to highly optimized WebP format
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file); // Fallback to original
            }

            // Create a new File from the blob, renaming extension to .webp
            const originalNameWithoutExt = file.name.substring(
              0,
              file.name.lastIndexOf(".")
            ) || file.name;
            
            const webpFile = new File(
              [blob],
              `${originalNameWithoutExt}.webp`,
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );

            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // Fallback to original
      };
    };

    reader.onerror = () => {
      resolve(file); // Fallback to original
    };
  });
}
