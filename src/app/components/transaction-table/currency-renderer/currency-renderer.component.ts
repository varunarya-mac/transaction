import { Component } from "@angular/core";
import { AgRendererComponent } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
  template: ` {{ value | currency: "GBP" }} `,
  styles: [
  ]
})
export class CurrencyRendererComponent implements AgRendererComponent  {
  /** The cell value. */
  value: any;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    // return false to let ag-grid refresh the component via destroying and creating it
    this.value = params.value;
    return true;
  }
}