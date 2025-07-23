import apiClient from "./apiClient";

const TOKEN_KEY = 'token'

/**
 * Registers a new user.
 * Stores the returned token in localStorage.
 * @param {{ name:string, email:string, password:string }} credentials
 * @returns {{ user: object, token: string }}
 */
export async function register ({name, email, password}) {
    const { data } =await apiClient.post('/auth/register', {
        name,
        email,
        password,
    })
    const { token, user} = data
    localStorage.setItem(TOKEN_KEY, token)
    return { user, token }
}
/**
 * Logs in an existing user.
 * Stores the returned token in localStorage.
 * @param {{ email:string, password:string }} credentials
 * @returns {{ user: object, token: string }}
 */
export async function login ({ email, password}) {
    const { data } = await apiClient.post('/auth/login', {
        email,
        password,
    })
    const {token, user} = data
    localStorage.setItem(TOKEN_KEY, token)
    return { user, token }
}
/**
 * Gets the current authenticated user.
 * Requires the Authorization header via apiClient interceptor.
 * @returns {{ user: object }}
 */
export async function me() {
    const { data } = await apiClient.get('/auth/me')
    return data
}
/**
 * Refreshes the JWT.
 * Stores the new token in localStorage.
 * @returns {{ token: string }}
 */
export async function refresh() {
    const {data} = await apiClient.post('/auth/refresh')
    const{token} = data
    localStorage.setItem(TOKEN_KEY, token)
    return {token}
}
/**
 * Logs out the user (client‐side).
 * Clears the stored token.
 */
export function logout() {
localStorage.removeItem(TOKEN_KEY)
}

