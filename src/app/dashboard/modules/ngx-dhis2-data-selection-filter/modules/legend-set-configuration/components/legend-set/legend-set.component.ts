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

  onLegendItemDeleted(legendItem) {
    let sanitizedlegendSet = this.legendSet;
    let sanitizedLegends = [];
    this.legendSet.legends = this.legendSet.legends
      .filter((legend) => {
        (legendItem.id != legend.id) ? 
            sanitizedLegends.push(legend) : null;
      });
    sanitizedlegendSet.legends = sanitizedLegends;
  }

  updateLegendRangeValues(data_legend) {
    let sanitizedlegendSet = this.legendSet;
    let sanitizedLegends = [];
    this.legendSet.legends
      .map((legend) => {
        (legend.id == data_legend.id) ?
          sanitizedLegends.push(data_legend) :
            sanitizedLegends.push(legend);
        // this.legendSet.legends = this.updateLegendWithNewValuesBasedOnStandards(sanitizedLegends);
        this.legendSet.legends = sanitizedLegends;
        this.updateLegendWithNewValuesBasedOnStandards(sanitizedLegends);
      });
  }

  updateLegendWithNewValuesBasedOnStandards(legends) {
    event.stopPropagation();
    let sanitizedLegend = [];
    for(let index = 0; index < legends.length; index++) {
      (legends[index].startValue > 100 || legends[index].startValue > 100) ? console.log('This is beyond the limit') : console.log('This is perfect');
    }
    // console.log('LEGENDS: ' + JSON.stringify(legends));
    return sanitizedLegend;
  }
}

