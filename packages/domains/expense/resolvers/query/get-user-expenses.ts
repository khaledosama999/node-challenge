import { getUserExpenses } from '../../model';

export default function getUserExpensesResolver(parent, args, context) {
  return getUserExpenses(args.getUserExpensesInput);
}
