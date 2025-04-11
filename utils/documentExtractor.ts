export async function extractTextFromPDF(file: File): Promise<string> {
  // For now, return a simple text extraction
  // You'll need to implement proper PDF parsing here
  const text = await file.text();
  return text;
}

export async function extractTextFromDOCX(file: File): Promise<string> {
  // For now, return a simple text extraction
  // You'll need to implement proper DOCX parsing here
  const text = await file.text();
  return text;
} 