import { ApiError } from '@nc/utils/errors';
import { getUserExpenses } from '../model';
import { GetUserExpensesValidation } from '../validation/v1-get-user-expenses';
import { Router } from 'express';
import { secureTrim } from '../formatter';
import { to } from '@nc/utils/async';
import { validationMiddleWareGenerator } from '../../../../middleware/validation';

export const router = Router();

router.get('/get-user-expenses',
  validationMiddleWareGenerator({ querySchema: GetUserExpensesValidation }),
  async (req, res, next) => {
    const [expenseError, userExpenses] = await to(getUserExpenses(req.query as any));

    if (expenseError) {
      return next(new ApiError(expenseError, expenseError.status, `Could not get user expenses: ${expenseError}`, expenseError.title, req));
    }

    return res.json({
      ...userExpenses,
      expenses: userExpenses.expenses.map(secureTrim),
    });
  });
