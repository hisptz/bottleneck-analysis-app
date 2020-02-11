import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName',
})
export class FilterByNamePipe implements PipeTransform {
  transform(list: any[], name: any): any {
    if (!name) {
      return list;
    }

    return list.filter(
      (item: any) => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
}
