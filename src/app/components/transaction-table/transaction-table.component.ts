import { Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RowNode, ValueFormatterParams } from 'ag-grid-community';
import { UtilityService } from 'src/app/utility/utilityService';
import { IAction, Transaction, EActionType, Action } from '../../datamodel/transaction';
@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnInit, OnChanges {
  @Input() list: Transaction[];
  @Output() performActionOnTransaction = new EventEmitter<IAction>();


  private gridApi;
  private gridColumnApi;
  public overlayNoRowsTemplate: string;
  public columDefs = [];
  public rowData = [];
  public totalCashFlow = 0;
  constructor() {
    this.overlayNoRowsTemplate = `<span class="custom-ag-grid-overlay"> No Data Available </span>`;

    this.columDefs = [
      { headerName: '#', field:'sno', valueGetter: "node.rowIndex + 1" },
      { headerName: 'Date', field: 'date' },
      { headerName: 'Type', field: 'type' },
      { headerName: 'Security', field: 'security' },
      { headerName: 'Shares', field: 'share' },
      {
        headerName: 'Value',
        field: 'value',
        valueFormatter: this.valueFormatter
      },
      {
        headerName: 'Cashflow',
        field: 'cashflow',
        valueFormatter: this.currencyFormatter,
        cellStyle: this.currencyStyling,
        cellRendererSelector: (params) => params.data.cashflow,
      },
      { headerName: '', field: 'edit', cellRenderer: this.actionFormatter },
      { headerName: '', field: 'delete', cellRenderer: this.actionFormatter },
    ];

    this.rowData = [
      {
        date: '1',
        type: 'Buy',
        security: 'sd',
        share: '1',
        value: '100000000',
        cashflow: '1000000000',
        edit: 'sd',
        delete: 'dsf',
      },
      {
        date: '1',
        type: 'Buy',
        security: 'sd',
        share: '1',
        value: '100000000',
        cashflow: '1000000000',
        edit: 'sd',
        delete: 'dsf',
      },
      {
        date: '1',
        type: 'Buy',
        security: 'sd',
        share: '1',
        value: '100000000',
        cashflow: '1000000000',
        edit: 'sd',
        delete: 'dsf',
      },
      {
        date: '1',
        type: 'Sell',
        security: 'sd',
        share: '1',
        value: '100000000',
        cashflow: '1000000000',
        edit: 'sd',
        delete: 'dsf',
      },
      {
        date: '1',
        type: 'Buy',
        security: 'sd',
        share: '1',
        value: '100000000',
        cashflow: '1000000000',
        edit: 'sd',
        delete: 'dsf',
      },
    ];
  }
  ngOnInit(): void {}
  ngOnChanges(change: SimpleChanges): void {
    this.createRowsData(this.list);
    this.list.forEach(a => this.totalCashFlow += a.cashflow);
    this.totalCashFlow = UtilityService.convertPenseIntoPound(this.totalCashFlow);

  }

  createRowsData(listArray: Transaction[]) {
    this.rowData = [];
    for (const rowInfo of listArray) {
      this.rowData.push({
        date: rowInfo.date,
        type: rowInfo.type,
        security: rowInfo.security? rowInfo.security : 'n/a',
        share: rowInfo.shares? rowInfo.shares: 'n/a',
        value: rowInfo.value,
        cashflow: rowInfo.cashflow,
        edit: 'Edit',
        delete: 'Delete',
      });
    }
  }

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    
    // resize columns in the grid to fit the available space
    this.gridApi.sizeColumnsToFit();
    
    // this.gridApi.setPinnedBottomRowData([this.generatePinnedBottomData()]);
  }

  onCellClicked(event) {
    const transactionInfo = new Action();
    if(event.value === 'Delete') {
    transactionInfo.transactionDetail = this.list[event.rowIndex];
    transactionInfo.action = EActionType.delete;

    }
    if(event.value === 'Edit') {
      transactionInfo.transactionDetail = this.list[event.rowIndex];
      transactionInfo.action = EActionType.edit;
    }
    this.performActionOnTransaction.emit(transactionInfo);

  }

  actionFormatter(rowObject: ValueFormatterParams) {
    return `<a href="#" onclick="return false;">${rowObject.value}</a>`;
  }

  valueFormatter(rowObject: ValueFormatterParams) {
      return '£' + UtilityService.convertPenseIntoPound(rowObject.value);
    
  }

  currencyFormatter(rowObject: ValueFormatterParams) {
    if (rowObject.value > 0) {
      return '+£' + UtilityService.convertPenseIntoPound(rowObject.value);
    }
    return '-£' + (UtilityService.convertPenseIntoPound(rowObject.value) * -1 );
  }

  currencyStyling(rowObject: ValueFormatterParams) {
    if (rowObject.value > 0) {
      return { color: 'green' };
    }
    return { color: 'red' };
  }

  /**
   *Below code can be used calculate cashflow with table(Its advace feature of table). 
   * (not able to complete as of now)
   */

  /*generatePinnedBottomData() {
    // generate a row-data with null values
    let result = {};

    this.gridColumnApi.getAllGridColumns().forEach((item) => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }

  calculatePinnedBottomData(target: any) {
   
    let columnsWithAggregation = ['cashflow'];
    columnsWithAggregation.forEach((element) => {
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        
          target[element] += rowNode.data[element];
      });

    });
    return target;
  }*/
}
