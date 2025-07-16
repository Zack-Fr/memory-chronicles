// You can wire this up to your Laravel endpoint later
export async function sendLocation(coords) {
const res = await fetch('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coords),
    credentials: 'include'
})
if (!res.ok) throw new Error('Location upload failed')
return res.json()
}