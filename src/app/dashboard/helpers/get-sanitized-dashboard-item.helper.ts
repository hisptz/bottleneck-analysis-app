import { generateUid } from 'src/app/helpers';
import { camelCase } from 'lodash';

export function getSanitizedDashboardItem(dashboardItem: any) {
  switch (dashboardItem.type) {
    case 'APP':
      return {
        ...dashboardItem,
        id: generateUid()
      };
    default:
      return {
        ...dashboardItem,
        id: generateUid(),
        [camelCase(dashboardItem.type)]: {
          id: generateUid()
        }
      };
  }
}
