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
  }


  createRowsData(listArray: Transaction[]) {
    this.rowData = [];
    // for (let i =0; i < 2; i ++){
    //   this.rowData.push({
    //         date: listArray[i].date,
    //         type: listArray[i].type,
    //         security: listArray[i].security? listArray[i].security : 'n/a',
    //         share: listArray[i].shares? listArray[i].shares : 'n/a',
    //         value: listArray[i].value,
    //         cashflow: listArray[i].cashflow,
    //         edit: 'Edit',
    //         delete: 'Delete',
    //       });
    // }

    for (const rowInfo of listArray) {
      // console.log('--------------', rowInfo);
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
    console.log('-------333----------', event);
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
// '£' + rowObject.value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  currencyFormatter(rowObject: ValueFormatterParams) {
    if (rowObject.value > 0) {
      return '+£' + rowObject.value;
    }
    return '-£' + -rowObject.value;
  }

  currencyStyling(rowObject: ValueFormatterParams) {
    if (rowObject.value > 0) {
      return { color: 'green' };
    }
    return { color: 'red' };
  }

  generatePinnedBottomData() {
    // generate a row-data with null values
    let result = {};

    this.gridColumnApi.getAllGridColumns().forEach((item) => {
      result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }

  calculatePinnedBottomData(target: any) {
   
    let columnsWithAggregation = ['cashflow', 'value'];
    columnsWithAggregation.forEach((element) => {
      this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        // console.log('-------222----------', target[element] ,rowNode.data);
        
          target[element] += rowNode.data[element];
      });
      // console.log('-------000----------', target[element]);
      // if (Number(target[element]) < 0) {
      //   target[element] = -target[element];
      //   target[element] = `-£ ${target[element]}`;
      // } else {
      //   target[element] = `+£ ${target[element]}`;
      // }
    });
    // console.log('------------111--------------', target);
    return target;
  }
  

  // calculatePinnedBottomData(target: any) {
  //   //console.log(target);
  //   //list of columns fo aggregation
  //   let columnsWithAggregation = ['cashflow'];
  //   columnsWithAggregation.forEach((element) => {
  //     // console.log('------------111--------------element', element);
  //     this.gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
  //       // console.log('-------222----------', rowNode.data);
  //       if (
  //         rowNode.data.type === ETransactionType.deposit ||
  //         rowNode.data.type === ETransactionType.sell
  //       ) {
  //         target[element] += Number(rowNode.data[element]);
  //       } else {
  //         target[element] -= Number(rowNode.data[element]);
  //       }
  //     });

  //     if (target[element] < 0) {
  //       target[element] = -target[element];
  //       target[element] =
  //         '-£' +
  //         target[element].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  //     } else {
  //       target[element] =
  //         '+£' +
  //         target[element].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  //     }
  //   });
  //   // console.log('------------111--------------', target);
  //   return target;
  // }
}
