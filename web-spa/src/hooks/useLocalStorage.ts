import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // Initialize with defaultValue to match server render
  const [value, setValue] = useState<T>(defaultValue)

  // Load from localStorage after mount
  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    if (storedValue !== null) {
      setValue(JSON.parse(storedValue))
    }
  }, [key])

  // Update localStorage when value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

// Specific hooks for each preference
export const useClashingQueensPreference = () => {
  return useLocalStorage('clashingQueensEnabled', true)
}

export const useShowClockPreference = () => {
  return useLocalStorage('showClock', true)
}

export const useAutoPlaceXsPreference = () => {
  return useLocalStorage('autoPlaceXs', true)
}

export const useGroupingPreference = () => {
  return useLocalStorage('groupBySize', false)
}
