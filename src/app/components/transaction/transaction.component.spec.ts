import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TransactionComponent } from './transaction.component';
import { TransactionService } from '../../shared/services/transaction.service';
import { EActionType, ETransactionType, IAction, Transaction } from 'src/app/datamodel/transaction';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

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
    return of(mockTransactionObject);
  }

  public updateTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    return of(mockTransactionObject);   
  }

  public deleteTransaction(id: number): Observable<any> {
    return; 
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

  it('create new transaction',() => {
    spyOn(component,'updateNewTransactionDetail').and.callThrough();
    spyOn(component, 'showAlert')
    component.updateNewTransactionDetail(mockTransactionActionObject);
    expect(component.transactionDetailList.length).toBe(2);
    expect(component.showAlert).toHaveBeenCalled();
    expect(component.updateNewTransactionDetail).toHaveBeenCalled();
  });

  it('check if new transaction get failed', () => {

    component.updateNewTransactionDetail(mockTransactionActionObject);
    expect(component.transactionDetailList.length).toBe(2);
  });
  // it('check for transaction list length', () => {
  //   expect(component.transactionDetailList.length).toBe(1);
  // });
});
