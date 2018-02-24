import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kNumber'
})
export class KNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
  }

}
