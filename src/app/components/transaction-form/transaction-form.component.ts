import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ETransactionType,
  IAction,
  EActionType,
  Transaction,
  Action,
} from '../../datamodel/transaction';
import { UtilityService } from '../../utility/utilityService';

const enum ETitle {
  add = 'Add Transaction',
  edit = 'Edit Transaction',
  update = 'Update Transaction',
}

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit, OnChanges {
  public transactionForm: FormGroup;
  public transactionType = ETransactionType;
  public needExtraInfo = false;
  public isEdit = false;
  public title: string = ETitle.add;
  public btnTitle: string = ETitle.add;
  keys = Object.keys;

  @Input() transactionAction: IAction;
  @Output() newTransactionDetail = new EventEmitter<IAction>();

  constructor() {}

  ngOnInit(): void {
    // Create reactive form Object
    this.transactionForm = new FormGroup({
      transactionDate: new FormControl(
        UtilityService.getDateWithISOFormat(),
        Validators.required
      ),
      transactionTypeDropDown: new FormControl('', Validators.required),
      transactionSecurityName: new FormControl(
        { value: '', disabled: !this.needExtraInfo },
        Validators.required
      ),
      transactionShareCount: new FormControl(
        { value: '', disabled: !this.needExtraInfo },
        Validators.required
      ),
      transactionValue: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(): void {
    if (this.transactionAction?.action === EActionType.edit) {
      this.isEdit = true;
      this.title = `${ETitle.edit}(#${this.transactionAction.transactionDetail.id})` ;
      this.btnTitle = ETitle.update;
      if (
        this.transactionAction.transactionDetail?.type ===
          ETransactionType.buy ||
        this.transactionAction.transactionDetail?.type === ETransactionType.sell
      ) {
        this.needExtraInfo = true;
      }
      this.updateFormValues(this.transactionAction.transactionDetail);
    } else {
      this.isEdit = false;
      this.title = ETitle.add;
      this.btnTitle = ETitle.add;
    }
  }

  /**
   * This method get called when user is tring to edit fields
   * @param transaction Transaction object containing form fields value's
   */
  updateFormValues(transaction: Transaction) {
    this.transactionForm.setValue({
      transactionDate: transaction.date.substring(0, 16),
      transactionTypeDropDown: transaction.type,
      transactionSecurityName: transaction.security ? transaction.security : '',
      transactionShareCount: transaction.shares ? transaction.shares : '',
      transactionValue: UtilityService.convertPenseIntoPound(transaction.value),
    });
  }

  /**
   * This method get called on pressing Submit button on form
   */
  onSubmit() {
    const transactionInfo = new Action();
    transactionInfo.transactionDetail = new Transaction();

    if (this.isEdit) {
      transactionInfo.action = EActionType.edit;
      this.getFormValues(transactionInfo.transactionDetail);
      transactionInfo.transactionDetail.id =
        this.transactionAction.transactionDetail.id;
      this.newTransactionDetail.emit(transactionInfo);
      this.transactionForm.reset();
      this.setFormDefaultSetting();
    } else {
      transactionInfo.action = EActionType.create;
      this.getFormValues(transactionInfo.transactionDetail);
      this.newTransactionDetail.emit(transactionInfo);
      this.transactionForm.reset();
    }
  }

  /**
   * This method fill forms values in Transaction object
   * @param transactionObject: empty Transaction object 
   * @returns 
   */
  getFormValues(transactionObject: Transaction) {
    transactionObject.cashflow = UtilityService.convertPoundsIntoPense(this.getValueBasedOnTransactionType(
      this.transactionForm.value.transactionTypeDropDown,
      this.transactionForm.value.transactionValue
    ));
    // date object is converted into a string using toISOString() function.
    transactionObject.date = this.transactionForm.value?.transactionDate
      ? new Date(this.transactionForm.value?.transactionDate).toISOString()
      : new Date().toISOString();
    transactionObject.type =
      this.transactionForm.value?.transactionTypeDropDown;
    transactionObject.value = UtilityService.convertPoundsIntoPense(this.transactionForm.value?.transactionValue);
    if (this.transactionForm.value?.transactionSecurityName) {
      transactionObject.security =
        this.transactionForm.value?.transactionSecurityName;
    }
    if (this.transactionForm.value?.transactionSecurityName) {
      transactionObject.shares = this.transactionForm.value.transactionShareCount;
    }
    return;
  }

  getValueBasedOnTransactionType(type: ETransactionType, value: number) {
    if (type === ETransactionType.buy || type === ETransactionType.withdrawal) {
      return value * -1;
    }
    return value;
  }

  onOptionsSelected(value) {
    if (
      value &&
      (value === ETransactionType.buy || value === ETransactionType.sell)
    ) {
      this.needExtraInfo = true;
      this.transactionForm.patchValue({
        transactionSecurityName: '',
        transactionShareCount: '',
      });
      this.transactionForm.get('transactionSecurityName').enable();
      this.transactionForm.get('transactionShareCount').enable();
    } else {
      this.needExtraInfo = false;
      this.transactionForm.patchValue({
        transactionSecurityName: '',
        transactionShareCount: '',
      });
      this.transactionForm.get('transactionSecurityName').disable();
      this.transactionForm.get('transactionShareCount').disable();
    }
  }

  resetForm(): void {
    if (this.transactionForm) {
      this.transactionForm.reset();
      this.transactionForm.patchValue({
        transactionDate: UtilityService.getDateWithISOFormat(),
      });
      this.setFormDefaultSetting();
    }
  }

  setFormDefaultSetting() {
    this.isEdit = false;
    this.title = ETitle.add;
    this.btnTitle = ETitle.add;
  }
}
