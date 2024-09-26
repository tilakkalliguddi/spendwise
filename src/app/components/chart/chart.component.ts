import { Component, inject, computed, signal } from '@angular/core';
import { ExpenseManagementService } from '../../services/expense-manage.service';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective, FormsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class chartComponent {
  private expenseService = inject(ExpenseManagementService);
  fromDate = signal('');
  toDate = signal('');

  barChartData = computed(() => {
    const from = this.fromDate();
    const to = this.toDate();
    const getData = (from && to) ? this.expenseService.DailyData(new Date(from).getTime() / 1000, new Date(to).getTime() / 1000) : this.expenseService.monthlyData();
    const labels = Object.keys(getData);
    return {
      labels,
      datasets: [
        { label: 'credit', data: labels.map(key => getData[key].credit), backgroundColor: '#77ccaf' },
        { label: 'debit', data: labels.map(key => getData[key].debit), backgroundColor: '#f67d74' }
      ]
    };
  });
}