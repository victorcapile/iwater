import { useEffect, useState } from 'react'
import {
  ALERT_LITERS,
  IDEAL_LITERS,
  MAX_LITERS,
  getGaugeImage,
} from '../lib/consumption'
import { formatLiters } from '../lib/format'

const bubbles = [
  { left: '18%', size: 7, delay: '0s', duration: '7s' },
  { left: '38%', size: 4, delay: '1.2s', duration: '5.6s' },
  { left: '62%', size: 6, delay: '2.1s', duration: '8.2s' },
  { left: '79%', size: 3, delay: '0.7s', duration: '6.4s' },
]

interface WaterGaugeProps {
  total: number
  hasEntries: boolean
  idealLiters?: number
  alertLiters?: number
  maxLiters?: number
}

export function WaterGauge({
  total,
  hasEntries,
  idealLiters = IDEAL_LITERS,
  alertLiters = ALERT_LITERS,
  maxLiters = MAX_LITERS,
}: WaterGaugeProps) {
  const safeMax = Math.max(1, maxLiters)
  const target = Math.min(100, Math.max(0, (total / safeMax) * 100))
  const [level, setLevel] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLevel(target))
    return () => cancelAnimationFrame(frame)
  }, [target])

  const idealBottom = (idealLiters / safeMax) * 100
  const alertBottom = (alertLiters / safeMax) * 100

  return (
    <div className="relative">
      <div className="mx-auto w-fit rounded-[2rem] bg-agua-400 p-3 shadow-inner ring-1 ring-white/25 sm:p-4">
        <div
          className="gauge"
          role="img"
          aria-label={`Consumo de ${formatLiters(total)} litros no dia. Meta ideal de ${formatLiters(idealLiters)} litros e alerta em ${formatLiters(alertLiters)} litros.`}
        >
          <div className="gauge-water" style={{ height: `${level}%` }}>
            <div className="gauge-water-inner" aria-hidden="true">
              {bubbles.map((bubble, index) => (
                <span
                  key={index}
                  className="bubble"
                  style={{
                    left: bubble.left,
                    width: bubble.size,
                    height: bubble.size,
                    animationDelay: bubble.delay,
                    animationDuration: bubble.duration,
                  }}
                />
              ))}
            </div>
            <span className="water-surface" aria-hidden="true" />
          </div>

          <img
            src={getGaugeImage(hasEntries ? total : 0, idealLiters, alertLiters)}
            alt=""
            className="gauge-image"
            aria-hidden="true"
          />

          <div className="gauge-line text-[#8a1c1c]" style={{ bottom: `${idealBottom}%` }}>
            <span className="gauge-line-label text-[#8a1c1c]">
              ideal {formatLiters(idealLiters)} L
            </span>
          </div>
          <div className="gauge-line text-warning" style={{ bottom: `${alertBottom}%` }}>
            <span className="gauge-line-label text-warning">
              alerta {formatLiters(alertLiters)} L
            </span>
          </div>

          <div className="gauge-total rounded-2xl border border-white/60 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm">
            <p className="eyebrow">Consumo</p>
            <p className="text-2xl font-semibold tracking-tight">
              {formatLiters(total)}{' '}
              <span className="text-sm font-normal text-navy/50">L</span>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-navy/50">
        O nível da água sobe conforme o consumo do dia.
      </p>
    </div>
  )
}
