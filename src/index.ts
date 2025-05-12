import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Web2PdfOptions, BrowserPrintOptions } from './types';

export default class Html2PDF {
  private defaultOptions: Partial<Web2PdfOptions> = {
    filename: 'document.pdf',
    imageType: 'image/jpeg',
    quality: 0.95,
    pageMargin: 10
  };

  async print(options: Web2PdfOptions) {
    const mergedOptions = { ...this.defaultOptions, ...options,pageMargin: 10 };
    const element = document.getElementById(mergedOptions.elementId);

    if (!element) {
      throw new Error(`Element with ID ${mergedOptions.elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      useCORS: true,
      logging: false,
      scale: 2,
      ignoreElements: (el) => el.classList.contains(mergedOptions.excludeClass || '')
    });

    const imgData = canvas.toDataURL(
      mergedOptions.imageType,
      mergedOptions.quality
    );

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - mergedOptions.pageMargin * 2;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let position = 0;

    // 多页处理
    while (position < imgHeight) {
      if (position > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        'JPEG',
        mergedOptions.pageMargin,
        mergedOptions.pageMargin - position,
        imgWidth,
        imgHeight
      );
      position += pageHeight - mergedOptions.pageMargin * 2;
    }

    pdf.save(mergedOptions.filename);
  }

  /**
 * 调用浏览器打印
 * @param options 打印配置
 */
  browserPrint(options: BrowserPrintOptions = {}) {
    const {
      elementId = '',
      styleRules = '',
      copyStyles = true,
      cleanupDelay = 500
    } = options;

    // 克隆目标元素
    const originalElement = elementId ?
      document.getElementById(elementId) :
      document.body;
    if (!originalElement) return;

    const printContent = originalElement.cloneNode(true) as HTMLElement;

    // 创建打印容器
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.appendChild(printContent);

    // 样式处理
    const style = document.createElement('style');
    style.innerHTML = `
        @media screen {
          #print-container { 
            display: none !important; 
          }
        }
        ${styleRules}
      `;

    // 构建打印窗口
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
        <html>
          <head>
            <title>打印预览</title>
            ${copyStyles ? this.copyPageStyles() : ''}
          </head>
          <body>
            ${printContainer.outerHTML}
          </body>
        </html>
      `);
    printWindow?.document.close();

    // 延迟执行打印
    setTimeout(() => {
      printWindow?.print();
      setTimeout(() => printWindow?.close(), cleanupDelay);
    }, 500);
  }

  private copyPageStyles(): string {
    return Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');
  }
}