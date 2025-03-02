import imageCompression from "browser-image-compression";

export default async function CompressImage(imageFile: File) {
  const options = {
    maxSizeMB: 0.02, // Target file size in MB
    maxWidthOrHeight: 600, // Maximum dimensions
    useWebWorker: true, // Offload processing
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    const base64 = await convertFileToBase64(compressedFile);
    return base64;
  } catch (error) {
    console.error("Image compression error:", error);
    let errorMessage = "Image compression failed.";

    if (error instanceof Error) {
      if (error.message.includes("File size exceeds maxSizeMB")) {
        errorMessage = "Image is too large to compress.";
      } else if (error.message.includes("Invalid image format")) {
        errorMessage = "Invalid image format.";
      }
    }

    return {
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

async function convertFileToBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]); // Extract base64 part
        } else {
          reject(new Error("FileReader result is not a string"));
        }
      } else {
        reject(new Error("FileReader result is null"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
