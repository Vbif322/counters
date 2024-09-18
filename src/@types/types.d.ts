export interface counter {
  id: string;
  _type: [counterType];
  area: {
    id: string;
  };
  is_automatic: boolean | null;
  communication: string;
  description: string;
  serial_number: string;
  installation_date: string;
  brand_name: null;
  model_name: null;
  initial_values: number[];
}

export type counterType =
  | 'HotWaterAreaMeter'
  | 'ColdWaterAreaMeter'
  | 'AreaMeter'
  | undefined;
