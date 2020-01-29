import { Legend } from 'src/app/models/legend.model';
import { generateUid } from 'src/app/helpers';

export const DEFAULT_LEGEND_DEFINITIONS: Legend[] = [
  {
    id: generateUid(),
    name: 'Target achieved / on track',
    color: '#008000',
    startValue: 67,
    endValue: 100,
  },
  {
    id: generateUid(),
    name: 'Progress, but more effort required',
    color: '#FFFF00',
    startValue: 33,
    endValue: 67,
  },
  {
    id: generateUid(),
    name: 'Not on track',
    color: '#FF0000',
    startValue: 0,
    endValue: 33,
  },
  { id: generateUid(), name: 'N/A', color: '#D3D3D3', default: true },
  { id: generateUid(), name: 'No data', color: '#FFFFFF', default: true },
];
