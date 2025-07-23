// src/services/capsules.js
import apiClient from './apiClient'

/**
 * Fetch the current draft (or null).
 */
export async function getDraft() {
const res = await apiClient.get('/capsules/draft')
return res.data.data.draft
}

export async function getPublicCapsules(filters = {}) {
  // build only the valid params
  const params = {}
  if (filters.country && filters.country.length === 2) {
    params.country = filters.country.toUpperCase()
  }
  if (filters.mood)      params.mood      = filters.mood
  if (filters.date_from) params.date_from = filters.date_from
  if (filters.date_to)   params.date_to   = filters.date_to

  const res = await apiClient.get('/capsules/public', { params })
  return res.data.data.capsules
}
/**
 * Fetch a single capsule by its ID.
 * @param {number|string} id
 * @returns {object}  Capsule data
 */
export async function getCapsule(id) {
  const { data } = await apiClient.get(`/capsules/${id}`)
  const cap = data.data.capsule
  cap.attachments = cap.attachments.map(a => ({
    ...a,
    url: a.path ? `/attachments/${a.id}/download` : null
  }))
  return cap
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
export async function downloadZip(capsuleId) {
  const res = await apiClient.get(`/capsules/${capsuleId}/attachments/zip`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(res.data);
  const a   = document.createElement('a');
  a.href    = url;
  a.download= `capsule-${capsuleId}-attachments.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

