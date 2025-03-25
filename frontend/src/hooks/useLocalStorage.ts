import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  // Initialize with defaultValue to match server render
  const [value, setValue] = useState<T>(defaultValue);

  // Load from localStorage after mount
  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      setValue(JSON.parse(storedValue));
    }
  }, [key]);

  // Update localStorage when value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

// Specific hooks for each preference
export const useClashingQueensPreference = () => {
  return useLocalStorage('clashingQueensEnabled', true);
};

export const useShowClockPreference = () => {
  return useLocalStorage('showClock', true);
};

export const useAutoPlaceXsPreference = () => {
  return useLocalStorage('autoPlaceXs', true);
};

export const useGroupingPreference = () => {
  return useLocalStorage('groupBySize', false);
};

// For completed levels, we need a different approach since it's an array
export const useCompletedLevels = () => {
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('completedLevels');
    if (stored) {
      setCompletedLevels(JSON.parse(stored));
    }
  }, []);

  const markLevelAsCompleted = (levelNumber: number) => {
    setCompletedLevels((prev) => {
      if (!prev.includes(levelNumber)) {
        const newLevels = [...prev, levelNumber];
        localStorage.setItem('completedLevels', JSON.stringify(newLevels));
        return newLevels;
      }
      return prev;
    });
  };

  const isLevelCompleted = (levelNumber: number) => {
    return completedLevels.includes(levelNumber);
  };

  const resetCompletedLevels = () => {
    setCompletedLevels([]);
    localStorage.setItem('completedLevels', JSON.stringify([]));
  };

  return {
    completedLevels,
    markLevelAsCompleted,
    isLevelCompleted,
    resetCompletedLevels,
  };
};
