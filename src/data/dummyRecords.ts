import { SupplementRecord } from '../types';

export const dummyRecords: SupplementRecord[] = [
  {
    id: '1',
    brand: 'One Science Nutrition',
    productName: 'Iso Gold Whey Protein Isolate',
    category: 'Whey Protein',
    overallStatus: 'Pass',
    proteinContent: {
      claimed: 27,
      found: 26.8,
      percentage: 99.2
    },
    heavyMetals: {
      lead: 'Pass',
      arsenic: 'Pass',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: false,
    testDate: '2025-12-15',
    labReportUrl: '#',
    imageUrl: '/onescience.jpg',
    description: 'Premium whey protein isolate with high bioavailability and rapid absorption.',
    detailedResults: [
      { parameter: 'Protein (Dry Basis)', claimed: '27g', found: '26.8g', status: 'Pass' },
      { parameter: 'BCAA', claimed: '6.4g', found: '6.3g', status: 'Pass' },
      { parameter: 'Glutamine', claimed: '5.3g', found: '5.2g', status: 'Pass' }
    ]
  },
  {
    id: '2',
    brand: 'Coreblaze Nutrition',
    productName: 'Iso Core Whey',
    category: 'Whey Protein',
    overallStatus: 'Pass',
    proteinContent: {
      claimed: 27,
      found: 26.5,
      percentage: 98.1
    },
    heavyMetals: {
      lead: 'Pass',
      arsenic: 'Pass',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: false,
    testDate: '2026-01-10',
    labReportUrl: '#',
    imageUrl: '/coreblaze.jpg',
    description: 'Ultimate lean muscle protein with added digestive enzymes for better recovery.',
    detailedResults: [
      { parameter: 'Protein (Dry Basis)', claimed: '27g', found: '26.5g', status: 'Pass' },
      { parameter: 'BCAA', claimed: '5.93g', found: '5.8g', status: 'Pass' },
      { parameter: 'Glutamine', claimed: '4.54g', found: '4.4g', status: 'Pass' }
    ]
  },
  {
    id: '3',
    brand: 'Trikut Sport Supplements',
    productName: 'Premium Whey Protein',
    category: 'Whey Protein',
    overallStatus: 'Pass',
    heavyMetals: {
      lead: 'Pass',
      arsenic: 'Pass',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: false,
    testDate: '2026-02-05',
    labReportUrl: '#',
    imageUrl: '/trikut.jpg',
    description: '100% high quality whey protein formulated for fast digestion and muscle growth.',
    detailedResults: [
      { parameter: 'Protein', claimed: '24g', found: '23.9g', status: 'Pass' },
      { parameter: 'BCAA', claimed: '5.4g', found: '5.3g', status: 'Pass' },
      { parameter: 'Glutamine', claimed: '5g', found: '4.9g', status: 'Pass' }
    ]
  },
  {
    id: '4',
    brand: 'Kobra Nutrition',
    productName: 'The Bull Mass Gainer',
    category: 'Whey Protein',
    overallStatus: 'Warning',
    proteinContent: {
      claimed: 30,
      found: 22.5,
      percentage: 75
    },
    heavyMetals: {
      lead: 'Pass',
      arsenic: 'Pass',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: true,
    testDate: '2026-03-20',
    labReportUrl: '#',
    imageUrl: '/kobra.jpg',
    description: 'High calorie mass gainer. Testing revealed lower protein content than claimed and presence of amino spiking.',
    detailedResults: [
      { parameter: 'Protein Content', claimed: '30g', found: '22.5g', status: 'Warning', notes: 'Lower than label claim' },
      { parameter: 'Amino Spiking', claimed: 'None', found: 'Detected', status: 'Fail' }
    ]
  },
  {
    id: '5',
    brand: 'Optimum Nutrition',
    productName: 'Micronized Creatine Powder',
    category: 'Creatine',
    overallStatus: 'Pass',
    heavyMetals: {
      lead: 'Pass',
      arsenic: 'Pass',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: false,
    testDate: '2026-04-10',
    labReportUrl: '#',
    imageUrl: '/optimum.jpg',
    description: '100% pure micronized creatine monohydrate. Testing confirms 99.9% purity and no contaminants.',
    detailedResults: [
      { parameter: 'Creatine Monohydrate', claimed: '5g', found: '4.98g', status: 'Pass' },
      { parameter: 'Creatinine (Impurity)', claimed: '<100ppm', found: '45ppm', status: 'Pass' },
      { parameter: 'Dicyandiamide (Impurity)', claimed: '<50ppm', found: '12ppm', status: 'Pass' }
    ]
  },
  {
    id: '6',
    brand: 'MuscleTech',
    productName: 'Platinum Multivitamin',
    category: 'Multivitamin',
    overallStatus: 'Warning',
    heavyMetals: {
      lead: 'Pass',
      arsenic: 'Warning',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: false,
    testDate: '2026-03-25',
    labReportUrl: '#',
    imageUrl: '/muscletech.jpg',
    description: 'High-potency vitamin and mineral complex. Contains slightly elevated levels of arsenic but within safe limits.',
    detailedResults: [
      { parameter: 'Vitamin C', claimed: '135mg', found: '130mg', status: 'Pass' },
      { parameter: 'Vitamin D', claimed: '400 IU', found: '410 IU', status: 'Pass' },
      { parameter: 'Arsenic', claimed: 'N/A', found: '0.8 ppm', status: 'Warning', notes: 'Slightly elevated but below FDA limits' }
    ]
  },
  {
    id: '7',
    brand: 'Cellucor',
    productName: 'C4 Original',
    category: 'Pre-Workout',
    overallStatus: 'Fail',
    heavyMetals: {
      lead: 'Fail',
      arsenic: 'Pass',
      mercury: 'Pass',
      cadmium: 'Pass'
    },
    aminoSpiking: false,
    testDate: '2026-02-14',
    labReportUrl: '#',
    imageUrl: '/cellucor.jpg',
    description: 'Popular pre-workout formula. Failed heavy metal testing due to high lead content. Caffeine content was also significantly lower than claimed.',
    detailedResults: [
      { parameter: 'Caffeine Anhydrous', claimed: '150mg', found: '110mg', status: 'Fail', notes: 'Significantly under-dosed' },
      { parameter: 'Beta Alanine', claimed: '1.6g', found: '1.5g', status: 'Pass' },
      { parameter: 'Lead Content', claimed: 'N/A', found: '2.5 ppm', status: 'Fail', notes: 'Exceeds safety thresholds' }
    ]
  }
];
