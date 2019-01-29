import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'orgUnitGroupLevelFilter'
})
export class FilterByOrgUnitGroupLevelPipe implements PipeTransform {
  transform(list: any[], query: string, type?: string): any {
    if (!query) {
      return list;
    }
    const splitedQuery = query.split(':');
    const searchQuery =
      splitedQuery.length > 1 ? splitedQuery[1] : splitedQuery[0];

    if (splitedQuery.length > 1) {
      if (splitedQuery[0].toLowerCase() === type) {
        return this.filterList(list, searchQuery);
      } else {
        return [];
      }
    }
    return this.filterList(list, searchQuery);
  }

  filterList(list: any[], query: string) {
    return list.filter(
      item => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
}
