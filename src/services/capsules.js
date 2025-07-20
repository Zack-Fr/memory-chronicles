import apiClient from './apiClient'

//fetch all capsules belonging to the auth user
export async function getUserCapsules() {
const { data } = await apiClient.get('/capsules')
return data
}


export async function createCapsule (draft) {
    const { data } = await apiClient.post ('./create_capsules', draft)
    return data
}