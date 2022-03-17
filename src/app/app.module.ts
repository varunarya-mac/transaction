import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule} from 'ag-grid-angular';
import { CurrencyRendererComponent } from './components/transaction-table/currency-renderer/currency-renderer.component';
import { TransactionComponent } from './components/transaction/transaction.component'
import { HttpClientModule } from '@angular/common/http';
import { AlertStyleDirective } from './shared/directive/alert-style.directive';

@NgModule({
  declarations: [
    AppComponent,
    TransactionFormComponent,
    TransactionTableComponent,
    
    CurrencyRendererComponent,
    
    TransactionComponent,
    
    AlertStyleDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
