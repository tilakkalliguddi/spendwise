import { Component, inject, signal } from '@angular/core';
import { Validators, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseManagementService, TExpense } from '../../services/expense-manage.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})

export class expenseFormComponent {
  readonly dialogRef = inject(MatDialogRef<expenseFormComponent>);
  ExpenseManagementService = inject(ExpenseManagementService);

  isEditMode = signal<boolean>(false);
  editExpenseId: string | null = null;  

  expenseForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(3)]),
    description: new FormControl('', [Validators.required]),
    transactionType: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required, Validators.min(1)]),
    datetime: new FormControl(new Date().toISOString().slice(0, 16), [Validators.required])
  });

  setFormData(expense: TExpense) {
    this.expenseForm.patchValue({
      id:expense.id,
      title: expense.title,
      description: expense.description,
      transactionType: expense.transactionType,
      amount: expense.amount,
      datetime: new Date(expense.datetime * 1000).toISOString().slice(0, 16)
    });
    this.isEditMode.set(true);
    this.editExpenseId = expense.id;
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expenseData: TExpense = this.expenseForm.value;
      const unixTimestamp = new Date(expenseData.datetime).getTime() / 1000;
      expenseData.datetime = unixTimestamp;
      if (this.isEditMode()) {
        this.ExpenseManagementService.updateTransaction(this.editExpenseId!, expenseData);
      } else {
        this.ExpenseManagementService.save(expenseData);
      }
      this.expenseForm.reset();
      this.dialogRef.close();
    }
  }
}
