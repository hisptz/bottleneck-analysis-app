import { Legend } from '../models/legend-set';

export const DEFAULT_LEGENDS: Legend[] = [
  {
    id: '1',
    color: '#FF0000',
    name: 'low',
    startValue: 0,
    endValue: 50
  },
  {
    id: '2',
    color: '#FFFF00',
    name: 'mid',
    startValue: 51,
    endValue: 80
  },
  {
    id: '3',
    color: '#008000',
    name: 'high',
    startValue: 81,
    endValue: 100
  }
];
