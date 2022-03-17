import { TestBed } from '@angular/core/testing';

import { TransactionService } from './transaction.service';
import { HttpClientTestingModule , HttpTestingController} from '@angular/common/http/testing';
import { EActionType, ETransactionType, IAction, Transaction } from 'src/app/datamodel/transaction';
import { BaseUrl } from 'src/app/datamodel/constant';


const mockTransactionObject: Transaction[] =  [{
  cashflow:1000,
  date: 'test',
  type : ETransactionType.deposit,
  value : 100,
  security : 'share test',
  shares : 90,
  id : 1234,
}];

describe('TransactionService', () => {
  let service: TransactionService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(TransactionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
  service.getTransactionList().subscribe((res) => {
    expect(res).toEqual(mockTransactionObject);
  });

  const req = httpController.expectOne({
    method: 'GET',
    url: `${BaseUrl}transactions`,
  });

  req.flush(mockTransactionObject);
});

it('should call createTransaction and return the mockTransaction Object from the API', () => {
  
  service.createTransaction(mockTransactionObject[0]).subscribe((data) => {
    expect(data).toEqual(mockTransactionObject[0]);
  });

  const req = httpController.expectOne({
    method: 'POST',
    url: `${BaseUrl}transactions`,
  });

  req.flush(mockTransactionObject[0]);
});


it('should call updateTransaction and return the mockTransaction Object from the API', () => {
  service.updateTransaction(mockTransactionObject[0]).subscribe((data) => {
    expect(data).toEqual(mockTransactionObject[0]);
  });

  const req = httpController.expectOne({
    method: 'PUT',
    url: `${BaseUrl}transactions/${mockTransactionObject[0].id}`,
  });

  req.flush(mockTransactionObject[0]);
});



})
