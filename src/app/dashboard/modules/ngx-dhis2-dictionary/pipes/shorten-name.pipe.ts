import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenName'
})
export class ShortenNamePipe implements PipeTransform {
  transform(itemName: any, args?: any): any {
    if (itemName !== '') {
      return itemName.slice(0, 25) + '....';
    } else {
      return null;
    }
  }
}
