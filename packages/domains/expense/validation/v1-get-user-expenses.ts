import Joi from 'joi';
import { EXPENSES_SORT_KEYS, EXPENSES_STATUS } from '../types';
import { limit, order, page } from '@nc/utils/validation';

export const GetUserExpensesValidation = Joi.object({
  userId: Joi.string().guid().required(),
  status: Joi.string().valid(EXPENSES_STATUS.PENDING, EXPENSES_STATUS.PROCESSED),
  startDate: Joi.date(),
  endDate: Joi.date(),
  sortBy: Joi.string().valid(EXPENSES_SORT_KEYS.DATE_CREATED),
  order,
  limit,
  page,
});
