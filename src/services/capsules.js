import apiClient from './apiClient'

export async function createCapsule (draft) {
    const { data } = await apiClient.post ('./create_capsules', draft)
    return data
}