type Expense = {
    id: number
    date: string // YYYY-MM-DD
    amount: number
    category: string
    subcategory?: string
    comment?: string
}

type ExpensesData = Expense[]

export class ExpenseTracker {
    private expenses: ExpensesData = []

    addExpense(expense: Expense): void {
        this.expenses.push(expense)
    }

    getExpensesByCategory(startDate: string, endDate: string): Record<string, number> {
        return this.expenses
            .filter(exp => exp.date >= startDate && exp.date <= endDate)
            .reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount
                return acc
            }, {} as Record<string, number>)
    }

    getExpensesByDate(startDate: string, endDate: string): Record<string, number> {
        return this.expenses
            .filter(exp => exp.date >= startDate && exp.date <= endDate)
            .reduce((acc, exp) => {
                acc[exp.date] = (acc[exp.date] || 0) + exp.amount
                return acc
            }, {} as Record<string, number>)
    }

    getFilteredSum(filterFn): number {
        return this.expenses.filter(filterFn).reduce((sum, exp) => sum + exp.amount, 0)
    }

    getSortedCategoriesBySum(startDate: string, endDate: string): [string, number][] {
        const categorySums = this.getExpensesByCategory(startDate, endDate)
        return Object.entries(categorySums).sort((a, b) => b[1] - a[1])
    }
}