import { generateUid } from './generate-uid.helper';
import { Determinant } from '../models';

const DEFAULT_GROUP_COLORS: string[] = [
  '#7DB2E8',
  '#80CC33',
  '#40BF80',
  '#75F0F0',
  '#9485E0',
  '#D98CCC',
  '#D98C99',
  '#D9998C',
  '#9485E0',
  '#E09485',
  '#F7B26E',
  '#E6C419',
  '#BFBF40',
  '#E09485',
  '#808080',
  '#B2B24D',
  '#525214',
];

export function generateDeterminants(): Determinant[] {
  return [
    {
      name: 'Commodities',
      code: 'COMMODITIES',
      sortOrder: 1,
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1',
        },
      ],
      color: DEFAULT_GROUP_COLORS[0],
    },
    {
      name: 'Human Resources',
      code: 'HUMAN_RESOURCES',
      sortOrder: 2,
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1',
        },
      ],
      color: DEFAULT_GROUP_COLORS[1],
    },
    {
      name: 'Geographic Accessibility',
      code: 'GEOGRAPHICAL_ACCESSIBILITY',
      sortOrder: 3,
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1',
        },
      ],
      color: DEFAULT_GROUP_COLORS[2],
    },
    {
      name: 'Initial Utilisation',
      code: 'INITIAL_UTILIZATION',
      sortOrder: 4,
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1',
        },
      ],
      color: DEFAULT_GROUP_COLORS[3],
    },
    {
      name: 'Continuous Utilisation',
      code: 'CONTINUOUS_UTILISATION',
      sortOrder: 5,
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1',
        },
      ],
      color: DEFAULT_GROUP_COLORS[4],
    },
    {
      name: 'Effective Coverage',
      code: 'EFFECTIVE_COVERAGE',
      sortOrder: 6,
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1',
        },
      ],
      color: DEFAULT_GROUP_COLORS[5],
    },
  ];
}
