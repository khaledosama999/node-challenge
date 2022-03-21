import { format } from './formatter';
import { InternalError } from '@nc/utils/errors';
import { to } from '@nc/utils/async';
import { countUserExpenses, readUserExpenses } from './data/db-models';
import { Expense, getUserExpensesInput } from './types';

/**
 * Get a specific user Expenses
 *
 * @param {Object} args
 *
 * @param {String} args.userId  filter
 * @param {String} [args.status]  filter
 * @param {Date} [args.startDate]  search
 * @param {Date} [args.endDate]  search
 * @param {String} [args.sortBy]  sort
 * @param {Number} [args.order]  sort
 * @param {Number} args.limit  pagination
 * @param {Number} args.page  pagination
 *
 * @returns {Promise<Expense []>}
 */
export async function getUserExpenses(args: getUserExpensesInput): Promise<{
  expenses: Expense []
  pagination: {
    totalCount: number
    pages: number
  }
}> {
  const [
    [dbError, userExpenses],
    [dbCountError, userExpensesCount],
  ] = await Promise.all([to(readUserExpenses(args)), to(countUserExpenses(args))]);

  if (dbError || dbCountError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  const formattedUserExpenses = userExpenses.map(format);

  return {
    expenses: formattedUserExpenses,
    pagination: {
      totalCount: Number(userExpensesCount),
      pages: Math.ceil(userExpensesCount / args.limit),
    },
  };
}
