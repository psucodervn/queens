export interface Level {
  id: string;
  size: number;
  colorRegions: string[][];
  regionColors: { [key: string]: string };
  isNew?: boolean;
}

export interface BonusLevel {
  path: string;
  size: number;
  colorRegions: string[][];
  regionColors: { [key: string]: string };
}
