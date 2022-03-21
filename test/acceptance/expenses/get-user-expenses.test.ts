import { Api } from '../utils/api';
import { Expense } from '@nc/domain-expense/types';

describe('[Packages | Expense-domain | E2E] GET /v1/get-user-expenses', () => {
  const validateExpense = (expense) => {
    expect(expense.id).not.toBeUndefined();
    expect(expense.merchant_name).not.toBeUndefined();
    expect(expense.amount_in_cents).not.toBeUndefined();
    expect(expense.currency).not.toBeUndefined();
    expect(expense.user_id).not.toBeUndefined();
    expect(expense.date_created).not.toBeUndefined();
    expect(expense.status).not.toBeUndefined();
  };

  test('should get the expenses api for the given user id', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId })
      .expect(200)
      .then((res) => {
        const { body: { expenses } } = res;

        expenses.forEach((expense) => {
          expect(expense.user_id).toEqual(userId);
          validateExpense(expense);
        });

        expect(expenses).toHaveLength(3);
      });
  });

  test('should get the expenses api for the given user id filtered by status', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';
    const status = 'pending';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, status })
      .expect(200)
      .then((res) => {
        const { body: { expenses } } = res;

        expenses.forEach((expense) => {
          expect(expense.status).toEqual(status);
          validateExpense(expense);
        });

        expect(expenses).toHaveLength(1);
      });
  });

  test('should get the expenses api for the given user id filtered by start-date', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';
    const startDate = '2021-09-21';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, startDate })
      .expect(200)
      .then((res) => {
        const { body: { expenses } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);

          const expenseDateTimeStamp = new Date(expense.date_created).getTime();
          const startDateTimeStamp = new Date(startDate).getTime();

          expect(expenseDateTimeStamp).toBeGreaterThanOrEqual(startDateTimeStamp);
        });

        expect(expenses).toHaveLength(1);
      });
  });

  test('should get the expenses api for the given user id filtered by end-date', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';
    const endDate = '2021-09-20';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, endDate })
      .expect(200)
      .then((res) => {
        const { body: { expenses } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);

          const expenseDateTimeStamp = new Date(expense.date_created).getTime();
          const endDateTimeStamp = new Date(endDate).getTime();

          expect(expenseDateTimeStamp).toBeLessThanOrEqual(endDateTimeStamp);
        });

        expect(expenses).toHaveLength(1);
      });
  });

  test('should get the expenses api for the given user id sorted by date_created in descending order', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, sortBy: 'date_created', order: -1 })
      .expect(200)
      .then((res) => {
        const { body: { expenses } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);
        });

        expect(expenses).isSorted<Expense, Date>((expense) => expense.date_created, true);
        expect(expenses).toHaveLength(3);
      });
  });

  test('should get the expenses api for the given user id sorted by date_created in ascending order', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, sortBy: 'date_created', order: 1 })
      .expect(200)
      .then((res) => {
        const { body: { expenses } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);
        });

        expect(expenses).isSorted<Expense, Date>((expense) => expense.date_created, false);
        expect(expenses).toHaveLength(3);
      });
  });

  test('should get the expenses api for the given user id with limit', () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';

    return Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, limit: 1 })
      .expect(200)
      .then((res) => {
        const { body: { expenses, pagination } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);
        });

        expect(expenses).toHaveLength(1);
        expect(pagination.totalCount).toEqual(3);
        expect(pagination.pages).toEqual(3);
      });
  });

  test('should get the expenses api for the given user id with limit and skip', async () => {
    const userId = 'da140a29-ae80-4f0e-a62d-6c2d2bc8a474';

    const firstUserExpense = await Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, limit: 1, page: 1 })
      .expect(200)
      .then((res) => {
        const { body: { expenses, pagination } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);
        });

        expect(expenses).toHaveLength(1);
        expect(pagination.totalCount).toEqual(3);
        expect(pagination.pages).toEqual(3);

        return expenses[0];
      });

    const secondUserExpense = await Api.get('/expenses/v1/get-user-expenses')
      .query({ userId, limit: 1, page: 2 })
      .expect(200)
      .then((res) => {
        const { body: { expenses, pagination } } = res;

        expenses.forEach((expense) => {
          validateExpense(expense);
        });

        expect(expenses).toHaveLength(1);
        expect(pagination.totalCount).toEqual(3);
        expect(pagination.pages).toEqual(3);

        return expenses[0];
      });

    return expect(firstUserExpense.id).not.toEqual(secondUserExpense.id);
  });
});
