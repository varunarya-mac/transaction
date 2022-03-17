import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TransactionComponent } from './transaction.component';
import { TransactionService } from '../../shared/services/transaction.service';
import { EActionType, ETransactionType, IAction, Transaction } from 'src/app/datamodel/transaction';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

const mockTransactionObject: Transaction =  {
  cashflow:1000,
  date: 'test',
  type : ETransactionType.deposit,
  value : 100,
  security : 'share test',
  shares : 90,
  id : 1234,
};

const mockTransactionActionObject: IAction =  {
  transactionDetail: mockTransactionObject,
  action: EActionType.create
};
class MockTransactionService {
  
  getTransactionList(): Observable<any>  {
      return of({ transactions :[mockTransactionObject]});
  }

  public createTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    if(transactionDetail)
    return of(mockTransactionObject);
    else {
      const errorResponse = new HttpErrorResponse({
        error: { code: `400`, message: `request body is not correct` },
        status: 400,
        statusText: 'Bad Request',
     });
   
     return throwError(errorResponse)
    }
  }

  public updateTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    if(transactionDetail)
    return of(mockTransactionObject);
    else {
      const errorResponse = new HttpErrorResponse({
        error: { code: `404`, message: `request body is not correct` },
        status: 404,
        statusText: 'Bad Request',
     });
   
     return throwError(errorResponse)
    }   
  }

  public deleteTransaction(id: number): Observable<any> {
    if(id)
    return of();
    else {
      const errorResponse = new HttpErrorResponse({
        error: { code: `400`, message: `id parameter is missing` },
        status: 400,
        statusText: 'Bad Request',
     });
   
     return throwError(errorResponse)
    } 
  }
}

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionComponent],
      imports: [HttpClientTestingModule],
      providers: [ { provide: TransactionService, useClass: MockTransactionService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check for transaction list length', () => {
    expect(component.transactionDetailList.length).toBe(1);
  });

  it('create transaction', async() => {
    spyOn(component,'updateNewTransactionDetail').and.callThrough();
    spyOn(component, 'showAlert')
    mockTransactionActionObject.action = EActionType.create;
    component.updateNewTransactionDetail(mockTransactionActionObject);
    fixture.detectChanges();
    expect(component.showAlert).toHaveBeenCalled();
    expect(component.updateNewTransactionDetail).toHaveBeenCalled();
    expect(component.transactionDetailList.length).toBe(2);
  });

  it('create transaction with wrong parameters: should get failed', async()  => {

    spyOn(component,'updateNewTransactionDetail').and.callThrough();
    spyOn(window, 'alert');
    mockTransactionActionObject.transactionDetail = null;
    component.updateNewTransactionDetail(mockTransactionActionObject);
    expect(component.updateNewTransactionDetail).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });
  
  it('update transaction', async() => {
    spyOn(component,'updateNewTransactionDetail').and.callThrough();
    spyOn(component, 'showAlert')
    mockTransactionActionObject.action = EActionType.edit;
    component.updateNewTransactionDetail(mockTransactionActionObject);
    fixture.detectChanges();
    expect(component.transactionDetailList.length).toBe(1);
    expect(component.updateNewTransactionDetail).toHaveBeenCalled();
  });
  

  it('update transaction with wrong parameters: should get failed', () => {
    spyOn(component,'updateNewTransactionDetail').and.callThrough();
    spyOn(window, 'alert');
    mockTransactionActionObject.transactionDetail = null;
    mockTransactionActionObject.action = EActionType.edit;
    component.updateNewTransactionDetail(mockTransactionActionObject);
    expect(component.updateNewTransactionDetail).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('verify alert message values', () => {
    spyOn(component,'showAlert').and.callThrough();
    spyOn(window, 'setTimeout');
    component.showAlert(EActionType.edit);

    expect(component.showAlert).toHaveBeenCalled();
    expect(component.alertMessage).toBe('Transaction Updated!');
  });

  it('Delete transction record', async() => {
    spyOn(component,'deleteTransaction').and.callThrough();
    spyOn(component, 'showAlert');
    component.deleteTransaction(1234);
    fixture.detectChanges();
    expect(component.deleteTransaction).toHaveBeenCalled();
  });
});
