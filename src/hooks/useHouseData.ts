import { useEffect, useState } from 'react'
import {
  getBills,
  getMeterReadings,
  getProfile,
  subscribeHouse,
  type HouseProfile,
  type MeterReading,
  type WaterBill,
} from '../lib/house'

export interface HouseState {
  profile: HouseProfile
  readings: MeterReading[]
  bills: WaterBill[]
}

function readHouseState(): HouseState {
  return {
    profile: getProfile(),
    readings: getMeterReadings(),
    bills: getBills(),
  }
}

export function useHouseData(): HouseState {
  const [state, setState] = useState<HouseState>(readHouseState)

  useEffect(() => {
    const update = () => setState(readHouseState())
    update()
    return subscribeHouse(update)
  }, [])

  return state
}
