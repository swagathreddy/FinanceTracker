'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { CategoryChart } from '@/components/CategoryChart';
import { BudgetForm } from '@/components/BudgetForm';
import { BudgetOverview } from '@/components/BudgetOverview';
import { BudgetChart } from '@/components/BudgetChart';
import { InsightsPanel } from '@/components/InsightsPanel';
import { Transaction, Budget, TransactionStorage, BudgetStorage } from '@/lib/storage';
import { getMonthlyExpenses, getCategoryExpenses, getCurrentMonth, getMonthlySpendingByCategory, formatCurrency } from '@/lib/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, Plus, X, Target, BarChart3, Lightbulb, IndianRupee } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setTransactions(TransactionStorage.getTransactions());
    setBudgets(BudgetStorage.getBudgets());
  }, []);

  const handleAddTransaction = (transactionData: {
    amount: number;
    date: string;
    description: string;
    type: 'income' | 'expense';
    category: string;
  }) => {
    const newTransaction = TransactionStorage.addTransaction(transactionData);
    setTransactions(prev => [...prev, newTransaction]);
    setShowTransactionForm(false);
  };

  const handleUpdateTransaction = (transactionData: {
    amount: number;
    date: string;
    description: string;
    type: 'income' | 'expense';
    category: string;
  }) => {
    if (!editingTransaction) return;

    const updatedTransaction = TransactionStorage.updateTransaction(editingTransaction.id, transactionData);
    if (updatedTransaction) {
      setTransactions(prev => 
        prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t)
      );
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      TransactionStorage.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddBudget = (budgetData: {
    category: string;
    amount: number;
    month: string;
  }) => {
    const newBudget = BudgetStorage.addBudget(budgetData);
    setBudgets(prev => [...prev.filter(b => !(b.category === budgetData.category && b.month === budgetData.month)), newBudget]);
    setShowBudgetForm(false);
  };

  const handleUpdateBudget = (budgetData: {
    category: string;
    amount: number;
    month: string;
  }) => {
    if (!editingBudget) return;

    const updatedBudget = BudgetStorage.updateBudget(editingBudget.id, budgetData);
    if (updatedBudget) {
      setBudgets(prev => 
        prev.map(b => b.id === editingBudget.id ? updatedBudget : b)
      );
    }
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      BudgetStorage.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    }
  };

  // Data calculations
  const monthlyData = getMonthlyExpenses(transactions);
  const categoryData = getCategoryExpenses(transactions);
  const currentMonth = getCurrentMonth();
  const currentMonthSpending = getMonthlySpendingByCategory(transactions, currentMonth);
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
  
  const budgetChartData = currentMonthBudgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    spent: currentMonthSpending[budget.category] || 0,
    remaining: budget.amount - (currentMonthSpending[budget.category] || 0)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personal Finance Tracker</h1>
                <p className="text-sm text-gray-600">Complete financial management in Indian Rupees (₹)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowBudgetForm(!showBudgetForm)}
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                {showBudgetForm ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Set Budget
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowTransactionForm(!showTransactionForm)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {showTransactionForm ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="budgets" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Budgets
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ExpenseChart data={monthlyData} />
                  <CategoryChart data={categoryData} />
                </div>
                {budgetChartData.length > 0 && (
                  <BudgetChart data={budgetChartData} />
                )}
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionList
                  transactions={transactions}
                  onEdit={setEditingTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </TabsContent>

              <TabsContent value="budgets">
                <BudgetOverview
                  budgets={budgets}
                  transactions={transactions}
                  onEditBudget={setEditingBudget}
                  onDeleteBudget={handleDeleteBudget}
                />
              </TabsContent>

              <TabsContent value="insights">
                <InsightsPanel
                  transactions={transactions}
                  budgets={budgets}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Forms */}
            {(showTransactionForm || editingTransaction) && (
              <TransactionForm
                transaction={editingTransaction || undefined}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                onCancel={() => {
                  setEditingTransaction(null);
                  setShowTransactionForm(false);
                }}
              />
            )}

            {(showBudgetForm || editingBudget) && (
              <BudgetForm
                budget={editingBudget || undefined}
                onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
                onCancel={() => {
                  setEditingBudget(null);
                  setShowBudgetForm(false);
                }}
              />
            )}

            {/* Welcome Card */}
            {!showTransactionForm && !editingTransaction && !showBudgetForm && !editingBudget && (
              <Card className="bg-gradient-to-br from-blue-100 to-purple-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 bg-blue-600 rounded-full w-fit mx-auto mb-4">
                      <IndianRupee className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Complete Finance Management
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Track transactions, set budgets, and get insights to achieve your financial goals in Indian Rupees.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => setShowTransactionForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                      <Button
                        onClick={() => setShowBudgetForm(true)}
                        variant="outline"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Set Budget
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            {transactions.length > 0 && !showTransactionForm && !editingTransaction && !showBudgetForm && !editingBudget && (
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Transactions</span>
                      <span className="font-semibold">{transactions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Budgets</span>
                      <span className="font-semibold">{currentMonthBudgets.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Categories Tracked</span>
                      <span className="font-semibold">{categoryData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">This Month Expenses</span>
                      <span className="font-semibold">
                        {formatCurrency(Object.values(currentMonthSpending).reduce((sum, amount) => sum + amount, 0))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}