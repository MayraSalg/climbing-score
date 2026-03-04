export const KEYS = { participants: 'cs_participants_v1', results: 'cs_results_v1' }
export function load(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch (e) { return fallback } }
export function save(key, data) { localStorage.setItem(key, JSON.stringify(data)) }