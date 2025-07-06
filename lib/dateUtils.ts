import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export const formatDate = (date: string) => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCurrentMonth = () => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthName = (monthString: string) => {
  return format(parseISO(`${monthString}-01`), 'MMMM yyyy');
};

export const getMonthlyExpenses = (transactions: Array<{ amount: number; date: string; type: 'income' | 'expense' }>) => {
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  return last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: format(month, 'MMM yyyy'),
      expenses,
      income,
      net: income - expenses,
    };
  });
};

export const getCategoryExpenses = (transactions: Array<{ amount: number; category: string; type: 'income' | 'expense' }>) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryTotals: Record<string, number> = {};

  expenseTransactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const getMonthlySpendingByCategory = (transactions: Array<{ amount: number; date: string; category: string; type: 'income' | 'expense' }>, month: string) => {
  const monthStart = startOfMonth(parseISO(`${month}-01`));
  const monthEnd = endOfMonth(parseISO(`${month}-01`));
  
  const monthTransactions = transactions.filter(t => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd && t.type === 'expense';
  });

  const categoryTotals: Record<string, number> = {};
  monthTransactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  return categoryTotals;
};