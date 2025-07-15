// src/components/Attachments/LocationSelector/LocationSelector.jsx
import React, { useEffect } from 'react'
import { MapPin } from 'lucide-react'
import useGeolocation from '../../../hooks/useGeolocation'
import styles from './LocationSelector.module.css'

export default function LocationSelector({ value, onChange }) {
const { coords, loading, error, getLocation } = useGeolocation()

  // Notify parent when coords update
useEffect(() => {
    if (coords) onChange(coords)
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

    {loading && <span className={styles.status}>…</span>}
    {value && (
        <span className={styles.status}>
        {value.lat.toFixed(3)}, {value.lng.toFixed(3)}
        </span>
    )}
    {error && <span className={styles.error}>{error}</span>}
    </div>
)
}
