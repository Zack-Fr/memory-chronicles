import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ScrollFrame from '../../components/ScrollFrame/ScrollFrameMap'
import { getPublicCapsules } from '../../services/capsules'
import styles from './WorldMapPage.module.css'
import pinSrc from '../../assets/images/WorldMap.svg'
import Navbar from '../../components/Navbar/Navbar'



export default function WorldMapPage() {
    const [capsules, setCapsules] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

useEffect(() => {
    const fetchCapsules = async () => {
    try {
        const data = await getPublicCapsules()
        console.log('🚀 fetching public capsules…')
        // console.log('🌍 public capsules:', data)
        setCapsules(data)
    } catch (err) {
        console.error(err)
        setError('Failed to load public capsules.')
    } finally {
        setLoading(false)
    }
    }
    fetchCapsules()
}, [])

if (loading) return <p className={styles.message}>Loading map…</p>
if (error) return <p className={styles.error}>{error}</p>

return (
    <div className={styles.container}>
                    <div className={styles.navWrapper}>
                    <Navbar />
                    </div>
    <h2 className={styles.title}>Worldwide Map</h2>

    <ScrollFrame className={styles.scroll}>
        <div className={styles.mapWrapper}>
          {/* Your parchment‐scroll map image */}
        <img
            src={pinSrc}
            alt="World map"
            className={styles.mapImage}
        />

          {/* Static pins */}
        {capsules.map(c => {
            if (!c.location) return null
            const { lat, lng } = c.location
            const xPct = ((lng + 180) / 360) * 100
            const yPct = ((90 - lat)  / 180) * 100
            // console.log(`Pin for ${c.id}`,{ lat,lng,xPct,yPct })

            return (
            <div
                key={c.id}
                className={styles.pin}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                onClick={() =>
                navigate(`/public/${c.country}`, {
                    state: { highlight: c.id }
                })
                }
                title={c.title}
            />
            )
        })}
        </div>
    </ScrollFrame>
    </div>
)
}
