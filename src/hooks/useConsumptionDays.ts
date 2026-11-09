import { useEffect, useState } from 'react'
import { getDays, subscribe, type DayRecord } from '../lib/storage'

export function useConsumptionDays(): DayRecord[] {
  const [days, setDays] = useState<DayRecord[]>(() => getDays())

  useEffect(() => {
    const update = () => setDays(getDays())
    update()
    return subscribe(update)
  }, [])

  return days
}
