export interface Device {
  id: number;
  brand: string;
  model: string;
  os: string;
  hasStepSensor: boolean;
  imageUrl: string;
}

export interface User {
  id: number;
  name: string;
  description: string;
  dailyGoalSteps: number;
  isActive: boolean;
  birthDate: string;
  imageUrl: string;
  plan: string;
  favoriteActivities: string[];
  device: Device;
}