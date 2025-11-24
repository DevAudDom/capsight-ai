declare module 'pdf-parse' {
  interface PdfInfo { numpages?: number; info?: any; metadata?: any; text: string; version?: string; }
  function pdfParse(dataBuffer: Buffer | Uint8Array, options?: any): Promise<PdfInfo>;
  export default pdfParse;
}

declare module 'mammoth' {
  interface MammothResult { value: string; messages: any[]; }
  interface ExtractOptions { path?: string; buffer?: Buffer; }
  export function extractRawText(opts: ExtractOptions): Promise<MammothResult>;
  const mammoth: { extractRawText: typeof extractRawText };
  export default mammoth;
}

declare module 'cors';
