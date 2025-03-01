import imageCompression from "browser-image-compression";

export default async function CompressImage(imageFile) {
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
    return null;
  }
}

async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract base64 part
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
