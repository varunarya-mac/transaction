import { Component } from '@angular/core';
import { Transaction } from './datamodel/transaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
public transactionList: Transaction[];
}
