import { Injectable, computed, effect, signal } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';

export type TExpense = {
    id: string;
    title: string;
    description: string;
    transactionType: 'Credit' | 'Debit';
    amount: number;
    datetime: number;
}
@Injectable({
    providedIn: 'root'
})

export class ExpenseManagementService {
    private storageKey = 'transactions';
    data = signal<TExpense[]>(this.getDataFromLS());

    constructor() {
        effect(() => {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data()))
        })
    }

    save(payload: TExpense) {
        this.data.update((items) => {
            const updatedItems = [...items, { ...payload, id: uuidv4() }].sort((a, b) => a.datetime - b.datetime);
            return updatedItems;
        })
    }

    getDataFromLS(): TExpense[] {
        const transactions = localStorage.getItem(this.storageKey);
        return transactions ? JSON.parse(transactions) as TExpense[] : [];
    }

    updateTransaction(id: string, updatedExpense: TExpense) {
        this.data.update((items) => {
            return items.map((expense) =>
                expense.id === id ? { ...updatedExpense, id } : expense
            );
        });
    }

    deleteTransaction(id: string) {
        this.data.update((items) => {
            return items.filter((expense) => expense.id !== id);
        });
    }

    totalCredit = computed(() => {
        return this.data().reduce((previousValue: number, currentValue: TExpense) => {
            return previousValue + (currentValue.transactionType === 'Credit' ? currentValue.amount : 0);
        }, 0)
    })
    totalDebit = computed(() => {
        return this.data().reduce((previousValue: number, currentValue: TExpense) => {
            return previousValue + (currentValue.transactionType === 'Debit' ? currentValue.amount : 0);
        }, 0)
    })
    balance = computed(() => {
        return this.totalCredit() - this.totalDebit()
    })


    monthlyData = computed(() => {
        const groupedData: Record<string, { credit: number; debit: number }> = {};
        this.data().forEach(expense => {
            const month = new Date(expense.datetime * 1000).toLocaleString('default', { month: 'long', year: 'numeric' });
            groupedData[month] = groupedData[month] || { credit: 0, debit: 0 };
            expense.transactionType === 'Credit' ? groupedData[month].credit += expense.amount : groupedData[month].debit += expense.amount;
        });
        return groupedData;
    });

    DailyData(fromDate: number, toDate: number) {
        const filteredData = this.data().filter(expense => {
            return expense.datetime >= fromDate && expense.datetime <= toDate;
        });
        const groupedData: Record<string, { credit: number; debit: number }> = {};
        filteredData.forEach(expense => {
            const date = new Date(expense.datetime * 1000).toLocaleDateString();
            groupedData[date] = groupedData[date] || { credit: 0, debit: 0 };
            expense.transactionType === 'Credit' ? groupedData[date].credit += expense.amount : groupedData[date].debit += expense.amount;
        });
        return groupedData;
    }
}
