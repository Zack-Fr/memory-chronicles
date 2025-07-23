// src/components/Attachments/LocationSelector/LocationSelector.jsx
// import React, { useEffect } from 'react'
// import { MapPin } from 'lucide-react'
// import useGeolocation from '../../../hooks/useGeolocation'
// import styles from './LocationSelector.module.css'

// export default function LocationSelector({ value, onChange }) {
// const { coords, loading, error, getLocation } = useGeolocation()

//   // Notify parent when coords update
// useEffect(() => {
//     if (coords) onChange(coords)
// }, [coords, onChange])

// return (
//     <div className={styles.container}>
//     <button
//         type="button"
//         className={styles.btn}
//         onClick={getLocation}
//         disabled={loading}
//         aria-pressed={!!value}
//         title="Attach Location"
//     >
//         <MapPin size={20} />
//     </button>

//     {loading && <span className={styles.status}>…</span>}
//     {value && (
//         <span className={styles.status}>
//         {value.lat.toFixed(3)}, {value.lng.toFixed(3)}
//         </span>
//     )}
//     {error && <span className={styles.error}>{error}</span>}
//     </div>
// )
// }
// src/components/Attachments/LocationSelector/LocationSelector.jsx
import React, { useEffect, useState } from 'react'
import { MapPin }                      from 'lucide-react'
import useGeolocation                  from '../../../hooks/useGeolocation'
import styles                          from './LocationSelector.module.css'

export default function LocationSelector({ value, onChange }) {
  // your existing GPS hook
  const { coords, loading, error, getLocation } = useGeolocation()

  // new: state for country lookup
  const [countryCode, setCountryCode] = useState('')
  const [geoLoading, setGeoLoading]   = useState(false)
  const [geoError, setGeoError]       = useState('')

  // 1) When coords arrive, kick off reverse‐geocoding
  useEffect(() => {
    if (!coords) return
    let cancelled = false

    const lookup = async () => {
      setGeoLoading(true)
      setGeoError('')

      try {
        // Build Nominatim URL
        const url = new URL('https://nominatim.openstreetmap.org/reverse')
        url.search = new URLSearchParams({
          lat: coords.lat.toString(),
          lon: coords.lng.toString(),
          format: 'json',
          addressdetails: '1',
        }).toString()

        const res = await fetch(url, {
          headers: {
            // Required per Nominatim usage policy
            'User-Agent': 'MemoryChronicles/1.0 (your-email@example.com)',
          },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json = await res.json()
        const cc   = json.address?.country_code?.toUpperCase() || ''

        if (!cancelled) {
          setCountryCode(cc)
          // 2) Notify parent with full info
          onChange({ 
            lat: coords.lat, 
            lng: coords.lng, 
            countryCode: cc 
          })
        }
      } catch (err) {
        console.error('Reverse geocode failed', err)
        if (!cancelled) {
          setGeoError('Could not determine country')
          onChange({ 
            lat: coords.lat, 
            lng: coords.lng, 
            countryCode: '' 
          })
        }
      } finally {
        if (!cancelled) setGeoLoading(false)
      }
    }

    lookup()
    return () => { cancelled = true }  // cancel if unmounted or coords change
  }, [coords, onChange])

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.btn}
        onClick={getLocation}
        disabled={loading}
        aria-pressed={!!value}
        title="Attach Location"
      >
        <MapPin size={20} />
      </button>

      {/* 3) Status indicators */}
      {loading && <span className={styles.status}>Locating…</span>}
      {error   && <span className={styles.error}>{error}</span>}

      {/* 4) Show coords when we have them */}
      {value && (
        <span className={styles.status}>
          {value.lat.toFixed(3)}, {value.lng.toFixed(3)}
        </span>
      )}

      {/* 5) Show geocode loading / error */}
      {geoLoading && <span className={styles.status}>Looking up country…</span>}
      {geoError   && <span className={styles.error}>{geoError}</span>}

      {/* 6) Show countryCode when known */}
      {value?.countryCode && (
        <span className={styles.status}>
          Country: {value.countryCode}
        </span>
      )}
    </div>
  )
}

