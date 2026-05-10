export type TestStatus = 'Pass' | 'Fail' | 'Warning';

export interface LabResult {
  parameter: string;
  claimed: string;
  found: string;
  status: TestStatus;
  notes?: string;
}

export interface SupplementRecord {
  id: string;
  brand: string;
  productName: string;
  category: 'Whey Protein' | 'Creatine' | 'Multivitamin' | 'Pre-Workout';
  overallStatus: TestStatus;
  proteinContent?: {
    claimed: number;
    found: number;
    percentage: number;
  };
  heavyMetals: {
    lead: TestStatus;
    arsenic: TestStatus;
    mercury: TestStatus;
    cadmium: TestStatus;
  };
  aminoSpiking: boolean;
  testDate: string;
  labReportUrl: string;
  imageUrl: string;
  description: string;
  detailedResults: LabResult[];
}
