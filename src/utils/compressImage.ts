export async function compressImage(file: File, maxSizeMB = 1.5): Promise<File> {
  // Se já estiver pequena o suficiente, não mexe
  if (file.size / 1024 / 1024 < maxSizeMB) {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  // Limita a largura máxima pra evitar imagens gigantes
  const MAX_WIDTH = 1600;
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);

  // Converte pra JPEG com qualidade reduzida (resolve HEIC também)
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.8)
  );

  if (!blob) return file;

  const newFile = new File(
    [blob],
    file.name.replace(/\.[^/.]+$/, "") + ".jpg",
    { type: "image/jpeg" }
  );

  return newFile;
}