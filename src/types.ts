export interface Web2PdfOptions {
  elementId: string;
  filename?: string;
  imageType?: 'image/png' | 'image/jpeg';
  quality?: number;
  pageMargin?: number;
  excludeClass?: string;
}

// src/types.ts
export interface BrowserPrintOptions {
  elementId?: string;          // 指定打印区域ID（空则打印整个页面）
  styleRules?: string;         // 自定义打印样式
  copyStyles?: boolean;        // 是否复制页面样式
  cleanupDelay?: number;       // 打印后关闭延迟（毫秒）
}