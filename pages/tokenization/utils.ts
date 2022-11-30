export function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = (error) => reject(error);
    });
}
