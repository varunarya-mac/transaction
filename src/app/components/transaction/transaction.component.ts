import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  ETransactionType,
  Transaction,
  IAction,
  EActionType,
} from 'src/app/datamodel/transaction';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  public transactionDetailList: Transaction[] = [];
  public transactionFormDetails: IAction;
  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getTransactionList().subscribe(
      (res) => {
        if (res?.transactions) {
          this.transactionDetailList = res.transactions as Transaction[];
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateNewTransactionDetail(transactionAction: IAction) {
    if (transactionAction.action === EActionType.create) {
      this.transactionService
        .createTransaction(transactionAction.transactionDetail)
        .subscribe(
          (res) => {
            const newTransactionObject = res as Transaction;
            if (newTransactionObject)
              this.transactionDetailList = [
                ...this.transactionDetailList,
                newTransactionObject,
              ];
          },
          (error: HttpErrorResponse) => {
            // Handle error
            // Use if conditions to check error code, this depends on your api, how it sends error messages
            console.log(error.message);
          }
        );
    } else if (transactionAction.action === EActionType.edit) {
      this.transactionService
        .updateTransaction(transactionAction.transactionDetail)
        .subscribe(
          (res) => {
            const newTransactionObject = res as Transaction;
            if (newTransactionObject){
              const index = this.transactionDetailList.findIndex(function (object) {
                return object.id === newTransactionObject.id;
              });
              if (index !== -1) {
                this.transactionDetailList[index] = newTransactionObject;
              }
            }
            this.transactionDetailList = [...this.transactionDetailList];
          },
          (error: HttpErrorResponse) => {
            // Handle error
            // Use if conditions to check error code, this depends on your api, how it sends error messages
            console.log(error.message);
          }
        );
    }
  }

  performActionOnTransaction(transactionAction: IAction) {
    if (transactionAction.action === EActionType.edit) {
      this.transactionFormDetails = transactionAction;
    } else if (transactionAction.action === EActionType.delete) {
      this.deleteTransaction(transactionAction.transactionDetail.id);
    }
  }

  updateTransaction() {
    const t = new Transaction();
    t.cashflow = 1000;
    t.date = 'test';
    t.type = ETransactionType.deposit;
    t.value = 100;
    t.security = 'share test';
    t.shares = 90;
    t.id = 1234;

    console.log('---------1----------');
  }

  deleteTransaction(id: number) {
    const t = new Transaction();
    t.cashflow = 1000;
    t.date = 'test';
    t.type = ETransactionType.deposit;
    t.value = 100;
    t.security = 'share test';
    t.shares = 90;
    t.id = 1234;

    console.log('---------1----------', id);
    this.transactionService.deleteTransaction(id).subscribe(
      (res) => {
        const index = this.transactionDetailList.findIndex(function (object) {
          return object.id === id;
        });
        if (index !== -1) {
          this.transactionDetailList.splice(index, 1);
          this.transactionDetailList = [...this.transactionDetailList];
        }
      },
      (error: HttpErrorResponse) => {
        // Handle error
        // Use if conditions to check error code, this depends on your api, how it sends error messages
      }
    );
  }
}
