/**
 * Upload an image file and return the resulting URL.
 *
 * This is a placeholder implementation that converts the file to a data URL
 * (base64). Replace the body of this function with a real upload call when a
 * backend is available.
 */
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
