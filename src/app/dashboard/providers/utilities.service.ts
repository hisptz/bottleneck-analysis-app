import { Injectable } from '@angular/core';

@Injectable()
export class UtilitiesService {

  constructor() { }

  formatEnumString(enumString){
    enumString = enumString.replace(/_/g,' ');
    enumString=enumString.toLowerCase();
    return enumString.substr(0,1)+enumString.replace(/(\b)([a-zA-Z])/g,
            function(firstLetter){
              return   firstLetter.toUpperCase();
            }).replace(/ /g,'').substr(1);
  }

}
