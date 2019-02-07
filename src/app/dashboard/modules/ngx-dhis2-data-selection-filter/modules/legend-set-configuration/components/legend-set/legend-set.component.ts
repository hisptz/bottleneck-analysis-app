import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LegendSet, Legend } from '../../models/legend-set';
import * as _ from 'lodash';
import * as lengeSetHelper from '../../helpers';

@Component({
  selector: 'app-legend-set',
  templateUrl: './legend-set.component.html',
  styleUrls: ['./legend-set.component.css']
})
export class LegendSetComponent implements OnInit {
  @Input()
  legendSet: LegendSet;

  constructor() {}

  ngOnInit() {}

  onLegendUpdates(data: Legend) {
    this.legendSet.legends = _.sortBy(
      _.map(this.legendSet.legends, legend => {
        return legend.id === data.id ? data : legend;
      }),
      'startValue'
    );
  }

  onDeleteLegend(data) {
    const { id } = data;
    this.legendSet.legends = _.filter(this.legendSet.legends, legend => {
      return legend.id !== id;
    });
  }
}
