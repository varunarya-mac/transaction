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

/**
 *Angular life cycle method 
 */
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

  /** 
   * This method works as callback from Transaction Form component
   * and calls transaction service http method based on trancaction action (Create/Edit)
   * @param transactionAction: Transaction Type  
   */
   updateTransactionRecords(transactionAction: IAction) {
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
           // showing alert if status code is not 201.  
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
            // showing alert if status code is not 200.
            if(error.status !== 200) {
              alert('Failed to update transaction record');
            }
          }
        );
    }
  }

  /**
   * This method work as callback from tansaction table
   * @param transactionAction Transaction Type (Edit/Delete)
   */
  performActionOnTransaction(transactionAction: IAction) {
    if (transactionAction.action === EActionType.edit) {
      this.transactionFormDetails = transactionAction;
    } else if (transactionAction.action === EActionType.delete) {
      this.deleteTransaction(transactionAction.transactionDetail.id);
    }
  }

/**
 * This method set message value after getting successful response from transaction API's,
 * and show response message for 5 seconds on screen 
 * @param actionType: Action Type (create/edit/delete)
 */
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

/**
 * This method calls transaction service for performing delete opration,
 * method also show alert if transaction id is missing 
 * @param id: Transaction id 
 */
  deleteTransaction(id: number) {
      if(id){
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
         if(error.status !== 204) {
          alert('Failed to delete transaction record');
        }
      }
    );}
    else {
      //Show alert if TransactionId is missing
      alert('Transaction ID is required for deletion');
    }
  }
}
