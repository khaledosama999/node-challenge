import _ from 'lodash';
import { Expense } from './types';

const publicFields = ['id', 'merchant_name', 'amount_in_cents', 'currency', 'user_id', 'date_created', 'company_name', 'status'];

export function capitalize(word) {
  const str = `${word}`;
  return str[0].toUpperCase() + str.slice(1);
}

export function secureTrim(expense: Expense): Partial<Expense> {
  return _.pick(expense, publicFields);
}

export function format(rawExpense: Expense): Expense {
  return {
    ...rawExpense,
    merchant_name: capitalize(rawExpense.merchant_name),
  };
}
