/**
 * Copyright (C) 2020 Rajab Mkomwa
 *
 * ngx-dhis2-components is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ngx-dhis2-components is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with ngx-dhis2-components. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'lib-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss'],
})
export class IndicatorComponent implements OnInit {
  @Input() dictionaryItem: any;
  todayDate: Date = new Date();
  listAllMetadataInGroup: boolean;

  @Output() setActive: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  onSetActive(id: string, e) {
    e.stopPropagation();
    this.setActive.emit(id);
  }

  formatTextToSentenceFormat(text) {
    text
      .split('_')
      .map((stringSection) => {
        return (
          stringSection.slice(0, 1).toUpperCase() +
          stringSection.slice(1).toLowerCase()
        );
      })
      .join(' ');
    return (
      text.split('_').join(' ').slice(0, 1).toUpperCase() +
      text.split('_').join(' ').slice(1).toLowerCase()
    );
  }

  getDataElementsGroups(dataElementGroups) {
    return dataElementGroups;
  }

  getDataSetFromDataElement(dataSetElements) {
    return dataSetElements;
  }

  getCategories(categoryOptionCombos) {
    const categories = [];
    categoryOptionCombos.forEach((categoryCombo) => {
      categoryCombo.categoryOptions.forEach((option) => {
        _.map(option.categories, (category: any) => {
          categories.push(category);
        });
      });
    });
    return _.uniqBy(categories, 'id');
  }

  getExpressionPart(element, indicator) {
    const expressionPartAvailability = [];
    if (indicator.numerator.indexOf(element.id) > -1) {
      expressionPartAvailability.push('Numerator');
    } else if (indicator.denominator.indexOf(element.id) > -1) {
      expressionPartAvailability.push('Denominator');
    }
    if (expressionPartAvailability.length == 1) {
      return expressionPartAvailability[0];
    } else if (expressionPartAvailability.length == 2) {
      return (
        expressionPartAvailability[0] + ' and ' + expressionPartAvailability[1]
      );
    } else {
      return 'None';
    }
  }

  sortLegends(legends) {
    return _.reverse(_.sortBy(legends, ['startValue']));
  }

  getOtherMetadata(allMedatada, listAllMetadataInGroup) {
    const newSlicedList = [];
    // _.map(allMedatada, (metadata) => {
    //   if (metadata.id !== this.selectedIndicator) {
    //     newSlicedList.push(metadata);
    //   }
    // })
    if (!listAllMetadataInGroup) {
      return allMedatada.slice(0, 3);
    } else {
      return allMedatada;
    }
  }
}
