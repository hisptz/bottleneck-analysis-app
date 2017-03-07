import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviate'
})
export class AbbreviatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let abbreviatedName: string = "";
    let count: number = 0;
    for(let i=0; i <= value.length-1;i++) {
      abbreviatedName += i==0 ? value[i] : "";
      if(value[i] == " ") {
        abbreviatedName += value[i+1];
        break;
      }
    }
    return abbreviatedName;
  }

}
