import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchIndicatorGroup'
})
export class SearchIndicatorGroupPipe implements PipeTransform {
  transform(indicatorGroups: any[], searchingTextForGroups: any): any {
    const splittedName = searchingTextForGroups
      ? searchingTextForGroups.split(/[\.\-_,; ]/)
      : [];
    return splittedName.length > 0
      ? indicatorGroups.filter((item: any) =>
          splittedName.some(
            (nameString: string) =>
              item.name.toLowerCase().indexOf(nameString.toLowerCase()) !== -1
          )
        )
      : indicatorGroups;
  }
}
