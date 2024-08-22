import { effect, Injectable } from '@angular/core';
import { IPDFViewerApplication, PDFNotificationService } from 'ngx-extended-pdf-viewer';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  public logs: Array<string> = [];

  private PDFViewerApplication!: IPDFViewerApplication;

  constructor(notificationService: PDFNotificationService) {
    effect(() => {
      if (this.PDFViewerApplication = notificationService.onPDFJSInitSignal()) {
        this.init();
      }
    });
  }

  public init(): void {
      if (this.PDFViewerApplication?.ngxConsole) {
      this.PDFViewerApplication.ngxConsole.ngxConsoleFilter = (level: string, message: any): boolean => {
        this.logs.push(message);
        return true;
      };
    }
  }
}
