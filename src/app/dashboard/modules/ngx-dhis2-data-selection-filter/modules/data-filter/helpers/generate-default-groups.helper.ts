import { generateUid } from '../../../../../../helpers/generate-uid.helper';

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
  '#525214'
];

export function generateDefaultGroups() {
  return [
    {
      name: 'Commodities',
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1'
        }
      ],
      color: DEFAULT_GROUP_COLORS[0]
    },
    {
      name: 'Human Resources',
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1'
        }
      ],
      color: DEFAULT_GROUP_COLORS[1]
    },
    {
      name: 'Geographic Accessibility',
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1'
        }
      ],
      color: DEFAULT_GROUP_COLORS[2]
    },
    {
      name: 'Initial Utilisation',
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1'
        }
      ],
      color: DEFAULT_GROUP_COLORS[3]
    },
    {
      name: 'Continuous Utilisation',
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1'
        }
      ],
      color: DEFAULT_GROUP_COLORS[4]
    },
    {
      name: 'Effective Coverage',
      id: generateUid(),
      members: [
        {
          id: generateUid(),
          name: 'Indicator 1'
        }
      ],
      color: DEFAULT_GROUP_COLORS[5]
    }
  ];
}
