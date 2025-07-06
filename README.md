# Personal Finance Tracker

A comprehensive personal finance management application built with Next.js, featuring transaction tracking, budgeting, and financial insights in Indian Rupees (₹).

## Features

### Stage 1: Basic Transaction Tracking
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with search and filters
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling

### Stage 2: Categories
- ✅ Predefined categories for transactions (Indian context)
- ✅ Category-wise pie chart
- ✅ Dashboard with summary cards
- ✅ Total expenses and category breakdown

### Stage 3: Budgeting
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart
- ✅ Spending insights and recommendations
- ✅ Budget progress tracking

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Local Storage (no authentication required)
- **Currency**: Indian Rupees (₹)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy automatically

### Manual Deployment

```bash
npm run build
```

The `out` folder contains the static files ready for deployment.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── BudgetChart.tsx   # Budget comparison chart
│   ├── BudgetForm.tsx    # Budget creation form
│   ├── BudgetOverview.tsx # Budget management
│   ├── CategoryChart.tsx  # Category pie chart
│   ├── ExpenseChart.tsx   # Monthly expense chart
│   ├── InsightsPanel.tsx  # Financial insights
│   ├── TransactionForm.tsx # Transaction form
│   └── TransactionList.tsx # Transaction list
├── lib/                   # Utility functions
│   ├── dateUtils.ts      # Date and currency formatting
│   ├── storage.ts        # Local storage management
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

## Features Overview

### Transaction Management
- Add income and expense transactions
- Edit and delete existing transactions
- Search and filter transactions
- Category-based organization

### Budget Planning
- Set monthly budgets by category
- Track spending against budgets
- Visual progress indicators
- Budget alerts and warnings

### Financial Insights
- Monthly spending trends
- Category-wise expense breakdown
- Savings rate calculation
- Personalized recommendations
