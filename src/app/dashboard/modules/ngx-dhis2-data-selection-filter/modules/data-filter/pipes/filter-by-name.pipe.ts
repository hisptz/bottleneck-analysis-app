import { Pipe, PipeTransform } from '@angular/core';
import { filterByName } from '../helpers';

@Pipe({
  name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {
  transform(list: any[], name: any): any {
    return filterByName(list, name);
  }
}
