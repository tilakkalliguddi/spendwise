import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { expenseFormComponent } from '../expense-form/expense-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  readonly dialog = inject(MatDialog);
  router = inject(Router)
  isStatsView = false;
  buttonText = 'Monthly Stats';

  openForm() {
    this.dialog.open(expenseFormComponent);
  }
  monthlyStats() {
    this.isStatsView = !this.isStatsView;
    if (this.isStatsView) {
      this.router.navigateByUrl('/stats');
      this.buttonText = 'Transactions';
    } else {
      this.router.navigateByUrl('/transactions');
      this.buttonText = 'Monthly Stats';
    }
  }
}
