import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readableName'
})
export class ReadableNamePipe implements PipeTransform {

  transform(name: any, underscore?: boolean): any {

    let readableName: any = [];
    let count: number = 0;
    for (let i = 0; i <= name.length-1; i++) {
      if(i == 0) {
        readableName[count] = name[i].toUpperCase();
        count++;
      } else {
        if(name[i] == name[i].toUpperCase()) {
          if(underscore) {
            readableName[count] = '_';
            count++;
            readableName[count] = name[i];
            count++;
          } else {
            readableName[count] = ' ';
            count++;
            readableName[count] = name[i].toLowerCase();
            count++;
          }

        } else{
          readableName[count] = name[i];
          count++;
        }
      }
    }

    return underscore ? readableName.join("").toUpperCase() : readableName.join("");
  }

}
