import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-table-item-cell',
  templateUrl: './table-item-cell.component.html',
  styleUrls: ['./table-item-cell.component.scss']
})
export class TableItemCellComponent implements OnInit {
  @Input()
  dataRowIds: string[];

  @Input()
  dataDimensions: string[];

  @Input()
  analyticsObject: any;

  @Input()
  legendSets: any[];

  dataValue: number;

  constructor() {}

  ngOnInit() {
    const dataIndex = this.analyticsObject.headers.indexOf(
      _.find(this.analyticsObject.headers, ['name', 'value'])
    );
    const dataValues = _.filter(
      _.map(
        _.filter(
          this.analyticsObject ? this.analyticsObject.rows || [] : [],
          (row: any[]) =>
            _.intersection(this.dataRowIds, row).length ===
            this.dataRowIds.length
        ),
        dataRow => parseFloat(dataRow[dataIndex])
      ),
      dataValue => dataValue
    );

    const isRatio = _.some(
      dataValues,
      dataValue => dataValue.toString().split('.')[1]
    );

    const dataValuesSum = _.sum(dataValues);

    if (isRatio) {
      this.dataValue = parseFloat(
        (dataValuesSum / dataValues.length).toFixed(2)
      );
    } else {
      this.dataValue = dataValuesSum;
    }
  }
}
