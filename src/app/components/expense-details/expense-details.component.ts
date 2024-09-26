import { Component, inject } from '@angular/core';
import { ExpenseManagementService, TExpense } from '../../services/expense-manage.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { expenseFormComponent } from '../expense-form/expense-form.component';


@Component({
  selector: 'app-expense-details',
  standalone: true,
  imports: [CommonModule, MatIconModule,expenseFormComponent],
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css']
})

export class expenseDetailsComponent {
  expenseManagementService = inject(ExpenseManagementService);
  readonly dialog = inject(MatDialog);

  editExpense(expense: TExpense) {
    const dialogRef = this.dialog.open(expenseFormComponent);
    dialogRef.componentInstance.setFormData(expense);
  }
  
  onDelete(expenseId: string) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseManagementService.deleteTransaction(expenseId);
    }
  }
}
