import { Legend } from '../models/legend-set';

export const DEFAULT_LEGENDS: Legend[] = [
  {
    id: '1',
    color: '#FF0000',
    name: 'low',
    startValue: 0,
    endValue: 33,
  },
  {
    id: '2',
    color: '#FFFF00',
    name: 'mid',
    startValue: 34,
    endValue: 66,
  },
  {
    id: '3',
    color: '#008000',
    name: 'high',
    startValue: 67,
    endValue: 100,
  },
  {
    id: '4',
    color: '	#B0B0B0',
    name: 'N/A',
    startValue: 100,
    endValue: 100,
  },
];
