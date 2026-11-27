import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().trim().min(2, 'Give the project a name').max(120),
  room: z.string().trim().min(1),
  priority: z.enum(['high', 'medium', 'low']),
  estimate: z.union([z.string(), z.number()]).transform((value) => Number(value || 0)).refine((value) => Number.isFinite(value) && value >= 0, 'Estimate must be zero or more'),
})

export const floorPlanRoomSchema = z.object({
  name: z.string().trim().min(1, 'Enter a room name').max(80),
  width: z.number().min(0.5).max(1000),
  height: z.number().min(0.5).max(1000),
  x: z.number().min(-500).max(500),
  y: z.number().min(-500).max(500),
  door: z.boolean(),
  window: z.boolean(),
})

export const maintenanceSchema = z.object({
  title: z.string().trim().min(2, 'Describe the maintenance task').max(120),
  room: z.string().trim().min(1),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid due date').refine((value) => { const [year, month, day] = value.split('-').map(Number); const date = new Date(Date.UTC(year, month - 1, day)); return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day }, 'Choose a real calendar date'),
  frequency: z.enum(['Weekly', 'Monthly', 'Quarterly', 'Twice yearly', 'Yearly', 'One-time']),
})

export function safeWorkspace(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  return {
    ...source,
    projects: Array.isArray(source.projects) ? source.projects : [],
    maintenance: Array.isArray(source.maintenance) ? source.maintenance : [],
    rooms: source.rooms && typeof source.rooms === 'object' && !Array.isArray(source.rooms) ? source.rooms : {},
    budget: Number.isFinite(Number(source.budget)) ? Number(source.budget) : 0,
  }
}
