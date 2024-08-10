import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { IPDFViewerApplication, NgxExtendedPdfViewerService, PDFNotificationService, RenderedTextLayerHighlights } from 'ngx-extended-pdf-viewer';
import { FindState, FindResultMatchesCount } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css'],
})
export class FindComponent {
  // tslint:disable-next-line:variable-name
  public _searchtext = 'Brazilian';

  public highlightAll = false;
  public matchCase = false;
  public wholeWord = false;
  public matchDiacritics = false;

  public currentMatchNumber: number | undefined;

  public totalMatches: number | undefined;

  public findState: FindState | undefined;

  private _fullscreen = false;

  private _selectedTab: number = 0;
  private PDFViewerApplication!: IPDFViewerApplication;
  public dontScrollIntoView: boolean | undefined;

  public pagesWithResult: Array<number> = [];

  public get selectedTab(): number {
    return this._selectedTab;
  }

  public set selectedTab(tab) {
    this._selectedTab = tab;
    if (tab !== 1) {
      this.resetFindResult();
    }
  }

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
  }

  public get findStateText(): string {
    switch (this.findState) {
      case FindState.FOUND:
        return 'found';
      case FindState.NOT_FOUND:
        return 'not found';
      case FindState.PENDING:
        return 'pending';
      case FindState.WRAPPED:
        return 'wrapped';
    }
    return '';
  }

  public get searchtext(): string {
    return this._searchtext;
  }

  public set searchtext(text: string) {
    this._searchtext = text;
    this.find();
  }

  private find() {
    this.pagesWithResult = [];
    if (!this._searchtext) {
      this.findState = undefined;
      this.currentMatchNumber = undefined;
      this.totalMatches = undefined;
    }
    const numberOfResultsPromises = this.ngxExtendedPdfViewerService.find(this._searchtext, {
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWords: this.wholeWord,
      matchDiacritics: this.matchDiacritics,
      dontScrollIntoView: this.dontScrollIntoView
    });
    numberOfResultsPromises?.forEach(async (numberOfResultsPromise, pageIndex) => {
      const numberOfResultsPerPage = await numberOfResultsPromise;
      if (numberOfResultsPerPage > 0) {
        this.pagesWithResult.push(pageIndex);
      }
    });
  }



  constructor(private ngxExtendedPdfViewerService: NgxExtendedPdfViewerService, private cdr: ChangeDetectorRef,
    notificationService: PDFNotificationService
  ) {
    effect(() => {
      this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
      this.PDFViewerApplication?.eventBus?.on('renderedtextlayerhighlights', (event: RenderedTextLayerHighlights) => {
        event.highlights.forEach((highlight) => {
          highlight.style.border = '2px solid black';
        });
      });
    });
  }

  public updateFindState(result: FindState) {
    this.findState = result;
  }

  public updateFindMatchesCount(result: FindResultMatchesCount) {
    this.currentMatchNumber = result.current;
    this.totalMatches = result.total;
    this.cdr.detectChanges();
  }

  public onCheckboxClicked() {
    this.ngxExtendedPdfViewerService.find(this._searchtext, {
      highlightAll: this.highlightAll,
      matchCase: this.matchCase,
      wholeWords: this.wholeWord,
      matchDiacritics: this.matchDiacritics,
      dontScrollIntoView: this.dontScrollIntoView
    });
  }

  public findNext(): void {
    this.ngxExtendedPdfViewerService.findNext();
  }

  public findPrevious(): void {
    this.ngxExtendedPdfViewerService.findPrevious();
  }

  public resetFindResult(): void {
    const allSpans = document.querySelectorAll('.textLayer > span') as NodeList;
    allSpans.forEach((span) => {
      (span as HTMLElement).classList.remove('fade-out');
    });
  }


}
