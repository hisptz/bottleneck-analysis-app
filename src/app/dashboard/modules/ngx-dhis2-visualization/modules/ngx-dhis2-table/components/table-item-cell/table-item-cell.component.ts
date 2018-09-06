import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { LegendSet } from '../../../../models';
import { Legend } from '../../../../../../../models';

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
  legendSet: LegendSet;

  dataValue: any;
  color: string;

  constructor() {}

  ngOnInit() {
    // Find data for the cell
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
      const dataValue = parseFloat(
        (dataValuesSum / dataValues.length).toFixed(2)
      );

      this.dataValue = dataValue !== 0 ? dataValue : '';
    } else {
      this.dataValue = dataValuesSum !== 0 ? dataValuesSum : '';
    }

    // Find color for the cell
    const legends: Legend[] = this.legendSet ? this.legendSet.legends : [];
    const associatedLegend: Legend = _.filter(legends, (legend: Legend) => {
      return _.inRange(this.dataValue, legend.startValue, legend.endValue);
    })[0];

    this.color =
      legends.length > 0
        ? associatedLegend && this.dataValue !== ''
          ? associatedLegend.color
          : '#ffffff'
        : this.dataValue !== ''
          ? '#eeeeee'
          : '#ffffff';
  }
}
