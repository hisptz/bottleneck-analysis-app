import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, args: number): string {
    let limit = args > 0 ? args : 100;
    let trail = value.length > limit ? '...' : '';

    return value.length > limit ? value.substring(0, limit) + trail: value;
  }
}
