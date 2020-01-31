import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'removeSelectedItems'
})
export class RemoveSelectedItemsPipe implements PipeTransform {
  transform(list: any, selectedItems: any[]): any {
    return _.filter(
      list || [],
      (listItem: any) => !_.find(selectedItems, ['id', listItem.id])
    );
  }
}
