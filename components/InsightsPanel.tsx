'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction, Budget } from '@/lib/storage';
import { formatCurrency, getCurrentMonth, getMonthlySpendingByCategory } from '@/lib/dateUtils';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';

interface InsightsPanelProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function InsightsPanel({ transactions, budgets }: InsightsPanelProps) {
  const currentMonth = getCurrentMonth();
  const currentMonthSpending = getMonthlySpendingByCategory(transactions, currentMonth);
  
  // Calculate insights
  const insights = [];

  // Top spending category
  const topCategory = Object.entries(currentMonthSpending)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topCategory) {
    insights.push({
      type: 'info',
      icon: TrendingUp,
      title: 'Top Spending Category',
      description: `You've spent ${formatCurrency(topCategory[1])} on ${topCategory[0]} this month.`,
      color: 'blue'
    });
  }

  // Budget warnings
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
  const overBudgetCategories = currentMonthBudgets.filter(budget => {
    const spent = currentMonthSpending[budget.category] || 0;
    return spent > budget.amount;
  });

  if (overBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      title: 'Budget Exceeded',
      description: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? 'category' : 'categories'}: ${overBudgetCategories.map(b => b.category).join(', ')}.`,
      color: 'red'
    });
  }

  // Categories close to budget
  const nearBudgetCategories = currentMonthBudgets.filter(budget => {
    const spent = currentMonthSpending[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    return percentage >= 80 && percentage < 100;
  });

  if (nearBudgetCategories.length > 0) {
    insights.push({
      type: 'warning',
      icon: Target,
      title: 'Approaching Budget Limit',
      description: `You're close to your budget limit in ${nearBudgetCategories.map(b => b.category).join(', ')}.`,
      color: 'yellow'
    });
  }

  // Spending trend
  const lastMonthTransactions = transactions.filter(t => {
    const transactionMonth = t.date.slice(0, 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return transactionMonth === lastMonth.toISOString().slice(0, 7) && t.type === 'expense';
  });

  const currentMonthTransactions = transactions.filter(t => {
    const transactionMonth = t.date.slice(0, 7);
    return transactionMonth === currentMonth && t.type === 'expense';
  });

  const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const currentMonthTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

  if (lastMonthTotal > 0) {
    const change = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    if (Math.abs(change) > 10) {
      insights.push({
        type: change > 0 ? 'warning' : 'success',
        icon: change > 0 ? TrendingUp : TrendingDown,
        title: `Spending ${change > 0 ? 'Increased' : 'Decreased'}`,
        description: `Your spending has ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last month.`,
        color: change > 0 ? 'red' : 'green'
      });
    }
  }

  // Savings opportunity
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.date.slice(0, 7) === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - currentMonthTotal) / totalIncome) * 100 : 0;
  
  if (totalIncome > 0) {
    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        icon: Target,
        title: 'Low Savings Rate',
        description: `You're saving only ${savingsRate.toFixed(1)}% of your income. Consider increasing your savings rate to at least 20%.`,
        color: 'yellow'
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Great Savings Rate',
        description: `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income this month.`,
        color: 'green'
      });
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Financial Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Add more transactions and budgets to get personalized insights.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  insight.color === 'red' ? 'bg-red-100' :
                  insight.color === 'yellow' ? 'bg-yellow-100' :
                  insight.color === 'green' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  <insight.icon className={`w-4 h-4 ${
                    insight.color === 'red' ? 'text-red-600' :
                    insight.color === 'yellow' ? 'text-yellow-600' :
                    insight.color === 'green' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                    <Badge 
                      variant="secondary"
                      className={
                        insight.color === 'red' ? 'bg-red-100 text-red-800' :
                        insight.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        insight.color === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}