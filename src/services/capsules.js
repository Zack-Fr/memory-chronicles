// src/services/capsules.js
import apiClient from './apiClient'

/**
 * Fetch the current draft (or null).
 */
export async function getDraft() {
const res = await apiClient.get('/capsules/draft')
return res.data.data.draft
}

/**
 * Upsert (create or update) the user’s draft capsule.
 */
export async function upsertDraft(draft) {
const res = await apiClient.post('/capsules/draft', draft)
return res.data.data.draft
}

/**
 * Finalize and create a new capsule.
 */
export async function createCapsule(payload) {
const res = await apiClient.post('/create_capsules', payload)
return res.data.data.capsule
}
export async function getUserCapsules() {
const res = await apiClient.get('/capsules')
  // res.data.data.capsules is the array from our new endpoint
return res.data.data.capsules
}
