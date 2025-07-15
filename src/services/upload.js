// Generic file-upload helper
export async function uploadAttachment(file) {
const formData = new FormData()
formData.append('file', file)

const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include'
})
if (!res.ok) throw new Error('Upload failed')
  return res.json()  // expect { url: '…', id: '…' }
}