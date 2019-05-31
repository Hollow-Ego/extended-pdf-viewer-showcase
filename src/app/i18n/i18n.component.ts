import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.css']
})
export class I18nComponent implements OnInit {
  public hidePdfViewer = false;

  private _language = 'es-ES';

  public get language(): string {
    return this._language;
  }

  public set language(language: string) {
    this._language = language;
    this.hidePdfViewer = true;
    setTimeout(() => {
      this.hidePdfViewer = false;
    }, 1000);
  }

  constructor() {}

  ngOnInit() {}
}
