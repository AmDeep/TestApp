export function nextMaintenanceDate(date, frequency) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ''))
  if (!match) return null
  const year = Number(match[1]), month = Number(match[2]) - 1, day = Number(match[3])
  const original = new Date(Date.UTC(year, month, day))
  if (original.getUTCFullYear() !== year || original.getUTCMonth() !== month || original.getUTCDate() !== day) return null
  if (frequency === 'Weekly') return new Date(Date.UTC(year, month, day + 7)).toISOString().slice(0, 10)
  const monthSteps = frequency === 'Monthly' ? 1 : frequency === 'Quarterly' ? 3 : frequency === 'Twice yearly' ? 6 : frequency === 'Yearly' ? 12 : 0
  if (!monthSteps) return null
  const targetMonthIndex = month + monthSteps
  const targetYear = year + Math.floor(targetMonthIndex / 12)
  const targetMonth = targetMonthIndex % 12
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate()
  return new Date(Date.UTC(targetYear, targetMonth, Math.min(day, lastDay))).toISOString().slice(0, 10)
}
