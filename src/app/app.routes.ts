import { Routes } from '@angular/router';
import { chartComponent } from './components/chart/chart.component';
import { expenseDetailsComponent } from './components/expense-details/expense-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'transactions',
    pathMatch: 'full'
  },
  {
    path: 'transactions',
    component: expenseDetailsComponent
  },
  {
    path: 'stats',
    component: chartComponent
  },
  { path: "**", component: expenseDetailsComponent }

];
