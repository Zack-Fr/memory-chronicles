import { useState } from 'react'

export default function useGeolocation() {
    const [coords, setCoords] = useState(null)
    const [loading, setLoading] =useState(false)
    const [error, setError] = useState(null)

    const getLocation =() => {
        if(!navigator.geolocation){
            setError('Geolocation not supported')
            return
        }
        setLoading(true)
        setError(null)

        navigator.geolocation.getCurrentPosition(
            position => {
                const {latitude: lat, longitude: lng} = position.coords
                setCoords({lat, lng})
                setLoading(false)
            },
            err => {
                setError(err.message)
                setLoading(false)
            }
        )
    }
    return {coords, loading, error, getLocation}
}