/* eslint-disable no-shadow */

export enum EXPENSES_STATUS {
    PENDING = 'pending',
    PROCESSED = 'processed'
}

export enum EXPENSES_SORT_KEYS {
    DATE_CREATED = 'date_created'
}

export interface getUserExpensesInput {
    userId: string
    status?: EXPENSES_STATUS
    startDate?: Date
    endDate?: Date
    sortBy?: string
    order?: number
    limit: number
    page: number
}

export interface Expense {
    id: string
    merchant_name: string
    amount_in_cents: number
    currency: string
    user_id: string
    date_created: Date
    status: EXPENSES_STATUS
}
