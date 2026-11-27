/** Defensive, local-first browser storage helpers. Never silently replace a valid backup. */
export const STORAGE_KEYS = Object.freeze({ profile: 'harmonious-home-v2', workspace: 'harmonious-home-workspace', ui: 'harmonious-home-ui-v1' })

export function safeReadJSON(key, fallback, storage) {
  try {
    storage ??= globalThis.localStorage
    const raw = storage?.getItem(key)
    if (raw == null) return { value: fallback, status: 'empty' }
    return { value: JSON.parse(raw), status: 'ok' }
  } catch (error) {
    return { value: fallback, status: error?.name === 'QuotaExceededError' ? 'quota' : 'invalid' }
  }
}

export function safeWriteJSON(key, value, storage) {
  try {
    storage ??= globalThis.localStorage
    storage?.setItem(key, JSON.stringify(value))
    return { ok: true, status: 'saved' }
  } catch (error) {
    return { ok: false, status: error?.name === 'QuotaExceededError' ? 'quota' : 'unavailable', error }
  }
}

export function validateBackup(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, reason: 'Backup must contain a JSON object.' }
  if (data.application !== 'Harmonious Home') return { ok: false, reason: 'This file is not a Harmonious Home backup.' }
  if (data.profile != null && (typeof data.profile !== 'object' || Array.isArray(data.profile))) return { ok: false, reason: 'The profile section is invalid.' }
  if (data.history != null && !Array.isArray(data.history)) return { ok: false, reason: 'The assessment history section is invalid.' }
  if (data.workspace != null && (typeof data.workspace !== 'object' || Array.isArray(data.workspace))) return { ok: false, reason: 'The workspace section is invalid.' }
  return { ok: true }
}

export function getStorageEstimate(storage) {
  try {
    storage ??= globalThis.localStorage
    let used = 0
    for (let i = 0; i < (storage?.length || 0); i++) {
      const key = storage.key(i)
      used += (key?.length || 0) + (storage.getItem(key)?.length || 0)
    }
    return { available: true, usedBytes: used * 2, usedKB: Math.round(used * 2 / 1024), entries: storage?.length || 0 }
  } catch { return { available: false, usedBytes: 0, usedKB: 0, entries: 0 } }
}

export function downloadJSON(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
