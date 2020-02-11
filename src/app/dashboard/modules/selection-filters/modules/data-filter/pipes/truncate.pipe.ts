import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(stringValue: any, truncateNumber: number): any {
    const stringLength = (stringValue || '').length;
    return (
      (stringValue || '').slice(0, truncateNumber) +
      `${stringLength > truncateNumber ? '...' : ''}`
    );
  }
}
