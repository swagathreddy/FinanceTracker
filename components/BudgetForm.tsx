'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Budget, EXPENSE_CATEGORIES } from '@/lib/storage';
import { getCurrentMonth, getMonthName } from '@/lib/dateUtils';
import { Target, Edit3, IndianRupee } from 'lucide-react';

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: (budget: {
    category: string;
    amount: number;
    month: string;
  }) => void;
  onCancel?: () => void;
}

export function BudgetForm({ budget, onSubmit, onCancel }: BudgetFormProps) {
  const [category, setCategory] = useState(budget?.category || '');
  const [amount, setAmount] = useState(budget?.amount?.toString() || '');
  const [month, setMonth] = useState(budget?.month || getCurrentMonth());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!month) {
      newErrors.month = 'Please select a month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      category,
      amount: Number(amount),
      month,
    });

    if (!budget) {
      // Reset form for new budgets
      setCategory('');
      setAmount('');
    }
  };

  // Generate month options (current month and next 11 months)
  const monthOptions = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const monthString = date.toISOString().slice(0, 7); // YYYY-MM format
    monthOptions.push({
      value: monthString,
      label: getMonthName(monthString)
    });
  }

  return (
    <Card className="w-full max-w-lg bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          {budget ? (
            <>
              <Edit3 className="w-5 h-5 text-blue-600" />
              Edit Budget
            </>
          ) : (
            <>
              <Target className="w-5 h-5 text-green-600" />
              Set Budget
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              Budget Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              step="1"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className={errors.month ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.month && <p className="text-sm text-red-500">{errors.month}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              {budget ? 'Update' : 'Set'} Budget
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}