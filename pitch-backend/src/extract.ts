import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
// For pptx, we can implement a very naive unzip + XML text extract later; placeholder for now.

export type SupportedExt = '.pdf' | '.txt' | '.doc' | '.docx' | '.pptx';

const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export async function extractText(filePath: string, originalName: string): Promise<string> {
  const stats = fs.statSync(filePath);
  if (stats.size > MAX_SIZE_BYTES) {
    throw new Error('File exceeds 25MB limit');
  }
  const ext = path.extname(originalName).toLowerCase() as SupportedExt;

  try {
    if (ext === '.pdf') {
      const data = await pdfParse(fs.readFileSync(filePath));
      return clean(data.text);
    }
    if (ext === '.txt') {
      return clean(fs.readFileSync(filePath, 'utf8'));
    }
    if (ext === '.docx') {
      const res = await mammoth.extractRawText({ path: filePath });
      return clean(res.value);
    }
    if (ext === '.doc') {
      // Not natively supported by mammoth; instruct user to convert.
      throw new Error('Legacy .doc not supported; please convert to .docx');
    }
    if (ext === '.pptx') {
      // TODO: implement proper pptx text extraction. Placeholder fallback.
      const content = fs.readFileSync(filePath);
      if (content.length < 100) return '';
      return '[[PPTX_EXTRACTION_NOT_IMPLEMENTED]]';
    }
    throw new Error('Unsupported file type');
  } catch (err: any) {
    throw new Error('Failed to extract text: ' + err.message);
  }
}

function clean(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
