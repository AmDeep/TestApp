import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeFinance, summarizeFinance, buildFinanceInsights } from '../src/finance.js'

test('finance summary separates paid, planned and committed costs', () => {
  const finance = { transactions:[
    {amount:100,tax:13,status:'paid',category:'Materials'},
    {amount:40,tax:5.2,status:'planned',category:'Labour'},
  ], orders:[
    {amount:200,status:'approved'}, {amount:75,status:'ordered'},
    {amount:900,status:'draft'}, {amount:500,status:'cancelled'},
  ], invoices:[{amount:60,status:'unpaid',due:'2026-12-01'}] }
  const s = summarizeFinance(finance,500,'2026-11-26')
  assert.equal(s.spent,113)
  assert.equal(s.planned,45.2)
  assert.equal(s.committed,275)
  assert.equal(s.outstanding,60)
  assert.equal(s.variance,112)
  assert.deepEqual(s.categoryTotals,{Materials:113})
})

test('overdue invoices exclude paid invoices and surface unpaid past-due invoices', () => {
  const finance = {invoices:[
    {amount:100,status:'unpaid',due:'2026-11-01'},
    {amount:50,status:'disputed',due:'2026-11-20'},
    {amount:75,status:'paid',due:'2026-11-01'},
    {amount:30,status:'unpaid',due:'2026-12-01'},
  ]}
  const s = summarizeFinance(finance,0,'2026-11-26')
  assert.equal(s.overdueInvoices.length,2)
  assert.equal(s.outstanding,180)
})

test('legacy or malformed finance data normalizes to safe empty collections', () => {
  const f = normalizeFinance({vendors:null,transactions:{},orders:[],invoices:'bad'})
  assert.deepEqual(f.vendors,[])
  assert.deepEqual(f.transactions,[])
  assert.deepEqual(f.orders,[])
  assert.deepEqual(f.invoices,[])
  assert.equal(f.currency,'CAD')
})

test('finance assistant identifies budget overruns, drafts and missing receipts', () => {
  const f = {transactions:[{amount:120,tax:0,status:'paid'}],orders:[{amount:50,status:'draft'}]}
  const s = summarizeFinance(f,100,'2026-11-26')
  const insights = buildFinanceInsights(f,s,n=>`$${n.toFixed(2)}`)
  assert.equal(insights.length,3)
  assert.ok(insights[0].body.includes("$20.00"))
  assert.match(insights[1].title,/purchase orders/i)
  assert.match(insights[2].title,/receipts/i)
})
