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
      catchError(this.handleError)
    );
  }

  public createTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    
    return this.http
      .post<any>(
        BaseUrl + 'transactions',
        JSON.stringify(transactionDetail),
        this.setHeader()
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  public updateTransaction(
    transactionDetail: Transaction
  ): Observable<Transaction> {
    return this.http
      .put<any>(
        BaseUrl + 'transactions/' + transactionDetail.id,
        JSON.stringify(transactionDetail),
        this.setHeader()
      )
      .pipe(
        catchError(this.handleError)
      );
  }

  setHeader() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return { headers: headers }
  }

  public deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(BaseUrl + 'transactions/' + id).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: Response) {
    return throwError(error);
  }
}
