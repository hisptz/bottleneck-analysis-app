import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName',
})
export class FilterByNamePipe implements PipeTransform {
  transform(list: any[], name: any): any {
<<<<<<< HEAD
    return name
      ? list.filter(
          (item: any) =>
            (item ? item.name : '')
              .toLowerCase()
              .indexOf(name.toLowerCase()) !== -1
        )
      : list;
=======
    if (!name) {
      return list;
    }

    return list.filter(
      (item: any) => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
>>>>>>> 1.0.0-rc.3
  }
}
