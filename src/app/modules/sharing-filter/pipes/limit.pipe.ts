import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {
  transform(list: any[], maxCount: number): any {
    return list.slice(0, maxCount);
  }
}
