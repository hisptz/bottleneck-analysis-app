import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName',
})
export class FilterByNamePipe implements PipeTransform {
  transform(list: any[], name: any): any {
    return name
      ? list.filter(
          (item: any) =>
            (item ? item.name : '')
              .toLowerCase()
              .indexOf(name.toLowerCase()) !== -1
        )
      : list;
  }
}
