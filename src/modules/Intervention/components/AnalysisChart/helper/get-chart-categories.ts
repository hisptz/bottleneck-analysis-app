import { Group } from "../../../../../shared/interfaces/interventionConfig";

export function getChartCategories(groups: Array<Group>): any {
  return groups.map(({ name, items }) => {
    return {
      name,
      categories: items.map(({ label }) => label),
    };
  });
}
