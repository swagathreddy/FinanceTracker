export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // YYYY-MM format
  createdAt: string;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Groceries',
  'Rent/EMI',
  'Mobile/Internet',
  'Fuel',
  'Insurance',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Business',
  'Rental Income',
  'Interest',
  'Dividend',
  'Gift',
  'Bonus',
  'Other'
];

export class TransactionStorage {
  private static STORAGE_KEY = 'personal-finance-transactions';

  static getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  static saveTransactions(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  static addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  static updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    transactions[index] = { ...transactions[index], ...updates };
    this.saveTransactions(transactions);
    return transactions[index];
  }

  static deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    
    if (filtered.length === transactions.length) return false;
    
    this.saveTransactions(filtered);
    return true;
  }
}

export class BudgetStorage {
  private static STORAGE_KEY = 'personal-finance-budgets';

  static getBudgets(): Budget[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading budgets:', error);
      return [];
    }
  }

  static saveBudgets(budgets: Budget[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  }

  static addBudget(budget: Omit<Budget, 'id' | 'createdAt'>): Budget {
    const budgets = this.getBudgets();
    
    // Remove existing budget for same category and month
    const filtered = budgets.filter(b => !(b.category === budget.category && b.month === budget.month));
    
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    filtered.push(newBudget);
    this.saveBudgets(filtered);
    return newBudget;
  }

  static updateBudget(id: string, updates: Partial<Budget>): Budget | null {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    
    if (index === -1) return null;
    
    budgets[index] = { ...budgets[index], ...updates };
    this.saveBudgets(budgets);
    return budgets[index];
  }

  static deleteBudget(id: string): boolean {
    const budgets = this.getBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    
    if (filtered.length === budgets.length) return false;
    
    this.saveBudgets(filtered);
    return true;
  }

  static getBudgetForCategoryAndMonth(category: string, month: string): Budget | null {
    const budgets = this.getBudgets();
    return budgets.find(b => b.category === category && b.month === month) || null;
  }
}