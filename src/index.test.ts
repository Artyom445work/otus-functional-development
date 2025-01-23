import {ExpenseTracker} from './index'
import { describe, expect, test } from '@jest/globals'

describe('ExpenseTracker', () => {
    let tracker: ExpenseTracker

    beforeEach(() => {
        tracker = new ExpenseTracker()
        tracker.addExpense({ id: 1, date: '2024-01-01', amount: 100, category: 'Food' })
        tracker.addExpense({ id: 2, date: '2024-01-02', amount: 200, category: 'Transport' })
        tracker.addExpense({ id: 3, date: '2024-01-02', amount: 50, category: 'Food' })
    })

    test('should calculate expenses by category correctly', () => {
        expect(tracker.getExpensesByCategory('2024-01-01', '2024-01-02')).toEqual({ Food: 150, Transport: 200 })
    })

    test('should calculate expenses by date correctly', () => {
        expect(tracker.getExpensesByDate('2024-01-01', '2024-01-02')).toEqual({ '2024-01-01': 100, '2024-01-02': 250 })
    })

    test('should filter and sum expenses correctly', () => {
        expect(tracker.getFilteredSum(exp => exp.category === 'Food')).toBe(150)
    })

    test('should sort categories by total sum', () => {
        expect(tracker.getSortedCategoriesBySum('2024-01-01', '2024-01-02')).toEqual([['Transport', 200], ['Food', 150]])
    })
})