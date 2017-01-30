import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableName'
})
export class ReadableNamePipe implements PipeTransform {

  transform(name: any, args?: any): any {

    let readableName: any = [];
    let count: number = 0;
    for (let i = 0; i <= name.length-1; i++) {
      if(i == 0) {
        readableName[count] = name[i].toUpperCase();
        count++;
      } else {
        if(name[i] == name[i].toUpperCase()) {
          readableName[count] = ' ';
          count++;
          readableName[count] = name[i].toLowerCase();
          count++;

        } else{
          readableName[count] = name[i];
          count++;
        }
      }
    }

    return readableName.join("");
  }

}
