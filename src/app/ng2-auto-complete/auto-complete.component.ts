import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { AutoComplete } from "./auto-complete";

/**
 * show a selected date in monthly calendar
 * Each filteredList item has the following property in addition to data itself
 *   1. displayValue as string e.g. Allen Kim
 *   2. dataValue as any e.g.
 */
@Component({
  selector: "auto-complete",
  template: `
  <div class="auto-complete">

    <!-- keyword input -->
    <input class="keyword"
           placeholder="{{placeholder}}"
           (focus)="showDropdownList()"
           (blur)="dropdownVisible=false"
           (keydown)="inputElKeyHandler($event)"
           (input)="reloadListInDelay()"
           [(ngModel)]="keyword" />

    <!-- dropdown that user can select -->
    <ul *ngIf="dropdownVisible"
      [style.bottom]="inputEl.style.height"
      [style.position]="closeToBottom ? 'absolute': ''">
      <li *ngIf="isLoading && keyword.length >= minChars" class="loading">Loading</li>
      <li *ngIf="blankOptionText"
          (mousedown)="selectOne('')"
          class="blank-item">{{blankOptionText}}</li>
      <li class="item"
          *ngFor="let item of filteredList; let i=index"
          (mousedown)="selectOne(item)"
          [ngClass]="{selected: i === itemIndex}"
          [innerHtml]="getFormattedList(item)">
      </li>
    </ul>

  </div>`,
  providers: [AutoComplete],
  styles: [`
  @keyframes slideDown {
    0% {
      transform:  translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  .auto-complete input {
    outline: none;
    border: 2px solid transparent;
    border-width: 3px 2px;
    margin: 0;
    box-sizing: border-box;
    background-clip: content-box;
  }

  .auto-complete ul {
    background-color: #fff;
    margin: 0;
    width : 100%;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    border: 1px solid #ccc;
    box-sizing: border-box;
    animation: slideDown 0.1s;
  }

  .auto-complete ul li {
    padding: 2px 5px;
    border-bottom: 1px solid #eee;
  }

  .auto-complete ul li.selected {
    background-color: #ccc;
  }

  .auto-complete ul li:last-child {
    border-bottom: none;
  }

  .auto-complete ul li:hover {
    background-color: #ccc;
  }`
  ],
  encapsulation: ViewEncapsulation.None
})
export class AutoCompleteComponent implements OnInit {

  /**
   * public input properties
   */
  @Input("list-formatter") listFormatter: (arg: any) => string;
  @Input('value-formatter') valueFormatter: (arg: any) => void;
  @Input("source") source: any;
  @Input("path-to-data") pathToData: string;
  @Input("min-chars") minChars: number = 0;
  @Input("value-property-name") valuePropertyName: string = "id";
  @Input("display-property-name") displayPropertyName: string = "value";
  @Input("placeholder") placeholder: string;
  @Input("blank-option-text") blankOptionText: string;

  el: HTMLElement;
  inputEl: HTMLInputElement;

  closeToBottom: boolean = false;
  dropdownVisible: boolean = false;
  isLoading: boolean = false;

  filteredList: any[] = [];
  itemIndex: number = 0;
  keyword: string;

  valueSelected: Subject<any> = new Subject();

  isSrcArr(): boolean {
    return (this.source.constructor.name === "Array");
  }

  /**
   * constructor
   */
  constructor(
    elementRef: ElementRef,
    public autoComplete: AutoComplete
  ) {
    this.el = elementRef.nativeElement;
  }

  /**
   * user enters into input el, shows list to select, then select one
   */
  ngOnInit(): void {
    this.inputEl = <HTMLInputElement>(this.el.querySelector("input"));
    this.autoComplete.source = this.source;
    this.autoComplete.pathToData = this.pathToData;
  }

  reloadListInDelay(): void {
    let delayMs = this.isSrcArr() ? 10 : 500;

    // executing after user stopped typing
    this.delay(() => this.reloadList(), delayMs);
  }

  showDropdownList(): void {
    this.keyword = "";
    this.inputEl.focus();
    this.reloadList();
  }

  hideDropdownList(): void {
    this.dropdownVisible = false;
  }

  reloadList(): void {
    let keyword = this.inputEl.value;

    this.hideDropdownList();
    this.dropdownVisible = true;

    if (this.isSrcArr()) {
      // local source
      this.filteredList = this.autoComplete.filter(this.source, this.keyword);
    } else {

      this.isLoading = true;

      if (keyword.length >= this.minChars) {
        if (typeof this.source === "function") {
          // custom function that returns observable
          this.source(keyword).subscribe(
            resp => {

              if (this.pathToData) {
                var paths = this.pathToData.split(".");
                paths.forEach(prop => resp = resp[prop]);
              }

              this.filteredList = resp;
            },
            error => null,
            () => this.isLoading = false // complete
          );
        } else {
          // remote source
          let query = { keyword: keyword };
          this.autoComplete.getRemoteData(query)
            .subscribe(
            resp => {
              this.filteredList = (<any>resp);
            },
            error => null,
            () => this.isLoading = false // complete
            );
        }
      }
    }
  }

  selectOne(data: any) {
    this.hideDropdownList();
    this.valueSelected.next(data);
  };

  inputElKeyHandler(evt: any) {
    let totalNumItem = this.filteredList.length;

    switch (evt.keyCode) {
      case 27: // ESC, hide auto complete
        this.hideDropdownList();
        break;

      case 38: // UP, select the previous li el
        this.itemIndex = (totalNumItem + this.itemIndex - 1) % totalNumItem;
        break;

      case 40: // DOWN, select the next li el or the first one
        this.dropdownVisible = true;
        this.itemIndex = (totalNumItem + this.itemIndex + 1) % totalNumItem;
        break;

      case 13: // ENTER, choose it!!
        if (this.filteredList.length > 0) {
          this.selectOne(this.filteredList[this.itemIndex]);
        }
        evt.preventDefault();
        break;
    }
  };

  getFormattedList(data: any): string {
    let formatter = this.listFormatter || this.defaultListFormatter;
    return formatter.apply(this, [data]);
  }

  private defaultListFormatter(data: any): string {
    let html: string = "";
    html += data[this.valuePropertyName] ? `<b>(${data[this.valuePropertyName]})</b>` : "";
    html += data[this.displayPropertyName] ? `<span>${data[this.displayPropertyName]}</span>` : data;
    return html;
  }

  private delay = (function () {
    var timer = 0;
    return function (callback: any, ms: number) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

}
