import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Alert } from 'selenium-webdriver';
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
  public alertMessage: string;
  constructor(private transactionService: TransactionService) {
    this.alertMessage = null;
  }

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
              this.showAlert(EActionType.create);

          },
          (error: HttpErrorResponse) => {
            // Handle error
            // Use if conditions to check error code, this depends on your api, how it sends error messages

            if(error.status !== 201) {
              alert('Failed to create transaction record');
            }
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
                this.showAlert(EActionType.edit);
              }
            }
            this.transactionDetailList = [...this.transactionDetailList];

          },
          (error: HttpErrorResponse) => {
            // Handle error
            // Use if conditions to check error code, this depends on your api, how it sends error messages


            if(error.status !== 200) {
              alert('Failed to update transaction record');
            }
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

  showAlert(actionType : EActionType) {
    switch (actionType) {
      case EActionType.create:
        this.alertMessage = 'Transaction Added!'
        break;
        case EActionType.edit:
          this.alertMessage = 'Transaction Updated!'
          break;
          case EActionType.delete:
        this.alertMessage = 'Transaction Deleted!'
        break;
      default:
      this.alertMessage = null;
        break;
    }

    if(this.alertMessage) {
      setTimeout(()=>{
        this.alertMessage = null;
      }, 3000);
    }

  }

  deleteTransaction(id: number) {
        this.transactionService.deleteTransaction(id).subscribe(
      () => {
        const index = this.transactionDetailList.findIndex(function (object) {
          return object.id === id;
        });
        if (index !== -1) {
          this.transactionDetailList.splice(index, 1);
          this.transactionDetailList = [...this.transactionDetailList];
          this.showAlert(EActionType.delete);
        }

      },
      (error: HttpErrorResponse) => {
        // Handle error
        // Use if conditions to check error code, this depends on your api, how it sends error messages
        if(error.status !== 204) {
          alert('Failed to delete transaction record');
        }
      }
    );
  }
}
