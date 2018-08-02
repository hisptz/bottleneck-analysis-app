import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType'
})
export class FilterByTypePipe implements PipeTransform {
  transform(list: any, filterType: string[]): any {
    return [];
  }
}
