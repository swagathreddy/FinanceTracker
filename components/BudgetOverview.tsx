'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget, Transaction } from '@/lib/storage';
import { formatCurrency, getCurrentMonth, getMonthName, getMonthlySpendingByCategory } from '@/lib/dateUtils';
import { Target, Edit3, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export function BudgetOverview({ budgets, transactions, onEditBudget, onDeleteBudget }: BudgetOverviewProps) {
  const currentMonth = getCurrentMonth();
  const currentMonthSpending = getMonthlySpendingByCategory(transactions, currentMonth);
  
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  const getBudgetStatus = (budget: Budget) => {
    const spent = currentMonthSpending[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    
    if (percentage >= 100) return { status: 'over', color: 'red' };
    if (percentage >= 80) return { status: 'warning', color: 'yellow' };
    return { status: 'good', color: 'green' };
  };

  const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = currentMonthBudgets.reduce((sum, b) => sum + (currentMonthSpending[b.category] || 0), 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Budget Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Target className="w-5 h-5 text-blue-600" />
            Budget Overview - {getMonthName(currentMonth)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-purple-800">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                {formatCurrency(totalBudget - totalSpent)}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{overallPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(overallPercentage, 100)} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMonthBudgets.length === 0 ? (
          <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Budgets Set</h3>
              <p className="text-gray-600 mb-4">
                Set your first budget to start tracking your spending goals for {getMonthName(currentMonth)}.
              </p>
            </CardContent>
          </Card>
        ) : (
          currentMonthBudgets.map((budget) => {
            const spent = currentMonthSpending[budget.category] || 0;
            const remaining = budget.amount - spent;
            const percentage = (spent / budget.amount) * 100;
            const status = getBudgetStatus(budget);

            return (
              <Card key={budget.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {budget.category}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      {status.status === 'over' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {status.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {status.status === 'good' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      <Badge 
                        variant={status.status === 'over' ? 'destructive' : 'secondary'}
                        className={
                          status.status === 'over' ? 'bg-red-100 text-red-800' :
                          status.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-semibold">{formatCurrency(budget.amount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Spent</p>
                        <p className="font-semibold">{formatCurrency(spent)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(remaining)} remaining
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditBudget(budget)}
                        className="flex-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteBudget(budget.id)}
                        className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}