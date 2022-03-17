export enum ETransactionType {
  buy = 'buy',
  sell = 'sell',
  deposit = 'deposit',
  withdrawal = 'withdrawal',
}

export enum EActionType {
  create = 'create',
  edit = 'edit',
  delete = 'delete'
}

export interface IAction {
  transactionDetail: Transaction;
  action: EActionType
} 

export class Action implements IAction {
  transactionDetail: Transaction;
  action: EActionType
} 


export interface ITransaction {
  id?: number;
  type: ETransactionType;
  date: string; //([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted date string)
  value: number; //(a Sterling **pence** value)
  cashflow: number; // (a Sterling **pence** cashflow change)
  security?: string; //(the name of the traded share)
  shares?: number; //(the number of the shares transacted)
}


export class Transaction implements ITransaction {
  id?: number;
  type: ETransactionType;
  date: string;
  value: number;
  cashflow: number;
  security?: string;
  shares?: number;
}
