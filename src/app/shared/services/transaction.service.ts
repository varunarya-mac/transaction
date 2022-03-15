import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BaseUrl } from 'src/app/datamodel/constant';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Transaction } from 'src/app/datamodel/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  public getTransactionList(): Observable<any> {
    return this.http.get<any>(BaseUrl + 'transactions').pipe(
      catchError((err) => {
        console.log('error caught in service');
        //Handle the error here if we want to show particular message string to component(s) based on error status

        return throwError(err); //Rethrow it back to component
      })
    );
  }

  public createTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = { headers: headers };

    return this.http
      .post<any>(
        BaseUrl + 'transactions',
        JSON.stringify(transactionDetail),
        options
      )
      .pipe(
        catchError((err) => {
          console.log('error caught in service');
          //Handle the error here if we want to show particular message string to component(s) based on error status

          return throwError(err); //Rethrow it back to component
        })
      );
  }

  public updateTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let options = { headers: headers };

    return this.http
      .put<any>(
        BaseUrl + 'transactions/' + transactionDetail.id,
        JSON.stringify(transactionDetail),
        options
      )
      .pipe(
        catchError((err) => {
          console.log('error caught in service');
          //Handle the error here if we want to send particular message string to component(s) based on error status

          return throwError(err); //Rethrow it back to component
        })
      );
  }

  public deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(BaseUrl + 'transactions/' + id).pipe(
      catchError((err) => {
        console.log('error caught in service');
        //Handle the error here if we want to show particular message string to component(s) based on error status

        return throwError(err); //Rethrow it back to component
      })
    );
  }
}
