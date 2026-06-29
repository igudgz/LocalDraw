export function sanitizeFileName(name: string, fallback = "drawing"): string {
  const sanitized = name.replace(/[^\w\s-]/g, "").trim();
  return sanitized.length > 0 ? sanitized : fallback;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  anchor.click();
  URL.revokeObjectURL(url);
}
