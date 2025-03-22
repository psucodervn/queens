export const markLevelAsCompleted = (levelNumber: number) => {
  const completedLevels = JSON.parse(window.localStorage.getItem('completedLevels') || '[]') || [];

  if (!completedLevels.includes(levelNumber)) {
    completedLevels.push(levelNumber);
    window.localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  }
};

export const isLevelCompleted = (levelNumber: number) => {
  return true;
  const completedLevels = JSON.parse(window.localStorage.getItem('completedLevels') || '[]') || [];
  return completedLevels.includes(levelNumber);
};

export const resetCompletedLevels = () => {
  window.localStorage.setItem('completedLevels', JSON.stringify([]));
};

export const setClashingQueensPreference = (enabled: boolean) => {
  window.localStorage.setItem('clashingQueensEnabled', JSON.stringify(enabled));
};

export const getClashingQueensPreference = (): boolean => {
  return true;
  const value = window.localStorage.getItem('clashingQueensEnabled');
  return value ? JSON.parse(value) : true; // Default to true if no value is found
};

export const setShowClockPreference = (enabled: boolean) => {
  window.localStorage.setItem('showClock', JSON.stringify(enabled));
};

export const getShowClockPreference = (): boolean => {
  return true;
  const value = window.localStorage.getItem('showClock');
  return value ? JSON.parse(value) : true; // Default to true if no value is found
};

export const setAutoPlaceXsPreference = (enabled: boolean) => {
  window.localStorage.setItem('autoPlaceXs', JSON.stringify(enabled));
};

export const getAutoPlaceXsPreference = (): boolean => {
  return true;
  const value = window.localStorage.getItem('autoPlaceXs');
  return value ? JSON.parse(value) : false; // Default to false if no value is found
};

export const setGroupingPreference = (enabled: boolean) => {
  window.localStorage.setItem('groupBySize', JSON.stringify(enabled));
};

export const getGroupingPreference = (): boolean => {
  return true;
  const value = window.localStorage.getItem('groupBySize');
  return value ? JSON.parse(value) : false; // Default to false if no value is found
};
