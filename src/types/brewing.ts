export type CoffeeProcess =
  | 'Washed'
  | 'Natural'
  | 'Honey'
  | 'Anaerobic Fermentation'
  | 'Experimental';

export type CoffeeVariety =
  | 'Bourbon'
  | 'Caturra'
  | 'Typica'
  | 'Gesha'
  | 'Mix Variety'
  | 'Local / Sigarar Utang';

export type RoastProfile =
  | 'Light'
  | 'Light-Medium'
  | 'Medium'
  | 'Dark';

export type BrewMethod = 'Hot' | 'Ice';

export type BrewerType = 'V60';

export type GrinderModel =
  | 'Timemore C2/C3'
  | 'Comandante C40'
  | 'Kingrinder K6'
  | '1Zpresso Q2/JX-Pro'
  | 'Fellow Ode'
  | 'Generic';

export type WaterSource =
  | 'Cleo'
  | 'Le Minerale'
  | 'Aqua'
  | 'RO Water'
  | 'Custom Mineral Water';

export type TargetProfile =
  | 'Balance & Clean'
  | 'More Sweetness'
  | 'More Acidity'
  | 'More Body';

export interface BrewInput {
  beanName: string;
  dose: number; // grams
  process: CoffeeProcess;
  variety: CoffeeVariety;
  roastProfile: RoastProfile;
  method: BrewMethod;
  brewer: BrewerType;
  grinder: GrinderModel;
  waterSource: WaterSource;
  targetProfile: TargetProfile;
}

export interface GrindSetting {
  grinderName: string;
  clicksOrSetting: string;
  micronDescription: string;
  adjustmentNote: string;
}

export interface BrewStep {
  stepNumber: number;
  name: string;
  waterAmount: number; // Volume of water poured in this step (g/ml)
  cumulativeWater: number; // Cumulative water volume up to this step (g/ml)
  startTimeSeconds: number; // Start time in seconds from 0
  endTimeSeconds: number; // End time in seconds
  timeRangeFormatted: string; // e.g. "00:00 - 00:45"
  technique: string; // e.g. "Spiral pour with gentle flow"
  note: string; // Additional tips for this step
}

export interface BrewRecipe {
  input: BrewInput;
  ratio: number; // e.g., 15 for 1:15
  ratioFormatted: string; // e.g., "1:15"
  dose: number; // g
  totalWater: number; // Total water equivalent in ml/g
  hotWater: number; // Hot water poured through dripper in ml/g
  iceAmount: number; // Ice in server (0 for Hot method) in g
  waterTemperature: number; // In Celsius
  grindSetting: GrindSetting;
  estimatedBrewTime: string; // e.g. "02:15 - 02:45"
  totalBrewTimeSeconds: number; // Target seconds for interactive timer
  steps: BrewStep[];
  flavorNotesExplanation: string;
  waterAdjustmentNote: string;
  brewerTips: string[];
}
