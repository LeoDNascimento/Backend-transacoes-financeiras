import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    try {
      const transactions = await this.find();

      const { income, outcome } = transactions.reduce(
        (accumulator, transaction) => {
          if (transaction.type === 'income') {
            accumulator.income += transaction.value;
          } else {
            accumulator.outcome += transaction.value;
          }
          return accumulator;
        },
        {
          income: 0,
          outcome: 0,
          total: 0,
        },
      );

      const total = income - outcome;

      return { income, outcome, total };
    } catch (err) {
      throw new AppError('Unable to get balance');
    }
  }
}

export default TransactionsRepository;
