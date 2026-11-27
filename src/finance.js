export const FINANCE_DEFAULTS = Object.freeze({ currency: 'CAD', vendors: [], transactions: [], orders: [], invoices: [] })

export function normalizeFinance(input = {}) {
  const value = input && typeof input === 'object' && !Array.isArray(input) ? input : {}
  return {
    ...FINANCE_DEFAULTS,
    ...value,
    vendors: Array.isArray(value.vendors) ? value.vendors : [],
    transactions: Array.isArray(value.transactions) ? value.transactions : [],
    orders: Array.isArray(value.orders) ? value.orders : [],
    invoices: Array.isArray(value.invoices) ? value.invoices : [],
  }
}

export const transactionGross = transaction => Number(transaction?.amount || 0) + Number(transaction?.tax || 0)

export function summarizeFinance(financeInput, budgetInput = 0, today = new Date().toISOString().slice(0, 10)) {
  const finance = normalizeFinance(financeInput)
  const paid = finance.transactions.filter(item => item.status === 'paid')
  const plannedTransactions = finance.transactions.filter(item => item.status === 'planned')
  const activeOrders = finance.orders.filter(item => ['approved', 'ordered'].includes(item.status))
  const unpaidInvoices = finance.invoices.filter(item => item.status !== 'paid')
  const overdueInvoices = unpaidInvoices.filter(item => item.due && item.due < today)
  const spent = paid.reduce((sum, item) => sum + transactionGross(item), 0)
  const planned = plannedTransactions.reduce((sum, item) => sum + transactionGross(item), 0)
  const committed = activeOrders.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const outstanding = unpaidInvoices.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const budget = Number(budgetInput || 0)
  const categoryTotals = paid.reduce((totals, item) => {
    const category = item.category || 'Other'
    totals[category] = (totals[category] || 0) + transactionGross(item)
    return totals
  }, {})
  return {
    spent, planned, committed, outstanding, budget,
    variance: budget - spent - committed,
    overdueInvoices,
    categoryTotals,
    paidCount: paid.length,
    plannedCount: plannedTransactions.length,
    activeOrderCount: activeOrders.length,
  }
}

export function buildFinanceInsights(financeInput, summary, formatMoney = value => Number(value).toFixed(2)) {
  const finance = normalizeFinance(financeInput)
  const insights = []
  if (summary.budget > 0 && summary.variance < 0) insights.push({ type: 'warning', title: 'Budget is over plan', body: `Paid costs and committed orders exceed the project budget by ${formatMoney(Math.abs(summary.variance))}. Review open orders before approving more spend.` })
  if (summary.overdueInvoices.length) insights.push({ type: 'warning', title: `${summary.overdueInvoices.length} invoice${summary.overdueInvoices.length === 1 ? '' : 's'} past due`, body: 'Review overdue invoices and contact the supplier where appropriate.' })
  const drafts = finance.orders.filter(item => item.status === 'draft').length
  if (drafts) insights.push({ type: 'info', title: 'Purchase orders awaiting review', body: `${drafts} draft order(s) have not been approved. Check amounts and delivery dates before commitment.` })
  const missingReceipts = finance.transactions.filter(item => item.status === 'paid' && !item.receiptName && !item.reference).length
  if (missingReceipts) insights.push({ type: 'info', title: 'Receipts need attention', body: `${missingReceipts} paid transaction(s) have no receipt or reference attached.` })
  if (!insights.length) insights.push({ type: 'success', title: 'Your finance desk is in good shape', body: 'No overdue invoices or obvious control gaps were detected in the records currently entered.' })
  return insights
}
