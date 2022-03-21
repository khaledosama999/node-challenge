import _ from 'lodash';
import { getUserExpensesInput } from '../types';
import { query } from '@nc/utils/db';

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
export function readUserExpenses(args: getUserExpensesInput) {
  const {
    userId,
    status,
    startDate,
    endDate,
    sortBy,
    order,
    limit,
    page,
  } = args;

  // Dynamically create the query from the given input as not all of them are required
  let SQLQuery = 'SELECT * FROM expenses WHERE user_id = $1';
  const parameters: any [] = [userId];
  let parameterCount = 2;

  if (!_.isNil(status)) {
    SQLQuery += ` AND status = $${parameterCount}`;
    parameters.push(status);

    parameterCount += 1;
  }

  if (!_.isNil(startDate)) {
    SQLQuery += ` AND date_created >= $${parameterCount}`;
    parameters.push(startDate);

    parameterCount += 1;
  }

  if (!_.isNil(endDate)) {
    SQLQuery += ` AND date_created <= $${parameterCount}`;
    parameters.push(endDate);

    parameterCount += 1;
  }

  if (!_.isNil(sortBy)) {
    SQLQuery += ` ORDER BY "${sortBy}"`;
  }

  if (!_.isNil(order)) {
    const sqlOrder = order === 1 ? 'ASC' : 'DESC';

    SQLQuery += ` ${sqlOrder}`;
  }

  if (!_.isNil(limit)) {
    SQLQuery += ` LIMIT $${parameterCount}`;
    parameters.push(limit);

    parameterCount += 1;
  }

  // Page 1 means means the user is requesting the first page, no need for offsets
  if (!_.isNil(page) && page > 1) {
    SQLQuery += ` OFFSET $${parameterCount}`;
    parameters.push(page - 1);

    parameterCount += 1;
  }

  console.log({ SQLQuery, parameters });

  return query(SQLQuery, parameters)
    .then((response) => response.rows);
}

/**
 * Counts the total number of specific user Expenses
 *
 * @param {Object} args
 *
 * @param {String} args.userId  filter
 * @param {String} [args.status]  filter
 * @param {Date} [args.startDate]  search
 * @param {Date} [args.endDate]  search
 *
 * @returns {Promise<Number>}
 */
export function countUserExpenses(args: Omit<getUserExpensesInput, 'sortBy'| 'order'| 'limit'| 'page'>) {
  const {
    userId,
    status,
    startDate,
    endDate,
  } = args;

  // Dynamically create the query from the given input as not all of them are required
  let SQLQuery = 'SELECT COUNT(*) as count FROM expenses WHERE user_id = $1';
  const parameters: any [] = [userId];
  let parameterCount = 2;

  if (!_.isNil(status)) {
    SQLQuery += ` AND status = $${parameterCount}`;
    parameters.push(status);

    parameterCount += 1;
  }

  if (!_.isNil(startDate)) {
    SQLQuery += ` AND date_created >= $${parameterCount}`;
    parameters.push(startDate);

    parameterCount += 1;
  }

  if (!_.isNil(endDate)) {
    SQLQuery += ` AND date_created < $${parameterCount}`;
    parameters.push(endDate);

    parameterCount += 1;
  }

  return query(SQLQuery, parameters)
    .then((response) => response.rows[0].count);
}
