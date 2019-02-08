import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { LegendSet, Legend } from '../../models/legend-set';
import * as _ from 'lodash';
import { ARROW_DOWN_ICON } from '../../icons/arrow-down.icon';
import * as legendHelper from '../../helpers';
@Component({
  selector: 'app-legend-set-container',
  templateUrl: './legend-set-container.component.html',
  styleUrls: ['./legend-set-container.component.css']
})
export class LegendSetContainerComponent implements OnInit, OnDestroy {
  @Input()
  selectedItems;
  @Input()
  legendSetEntities;
  @Input()
  legendItems: LegendSet[];

  @Output()
  legendSetConfigurationClose = new EventEmitter();
  legendSets: LegendSet[];
  currentLegendSet: string;
  arrowDownIcon: string;

  constructor() {
    this.currentLegendSet = '';
    this.arrowDownIcon = ARROW_DOWN_ICON;
  }

  ngOnInit() {
    const legendSets: LegendSet[] = legendHelper.getLegendSetsConfiguration(
      this.selectedItems,
      this.legendSetEntities
    );

    this.currentLegendSet =
      legendSets && legendSets.length > 0 ? legendSets[0].id : '';

    // this.legendSets = legendSets;

    this.legendSets = _.forEach(legendSets, legendData => {
      legendData.legends.length > 0
        ? this.addNotApplicableLegendStatus(
            legendData.legends,
            legendHelper.getDefaultLegends()
          )
        : (legendData.legends = legendHelper.getDefaultLegends());
    });
  }

  addNotApplicableLegendStatus(legends, defaultObj) {
    let localLegends = [];
    localLegends = legends;
    let notApplicableIndex = _.findLastIndex(defaultObj, legendObj => {
      return legendObj['name'] == 'N/A';
    });

    let leg = {
      id: 'RFKK007nOS9',
      name: 'High',
      color: '#3eef9c',
      endValue: 100,
      startValue: 61
    };

    !_.some(legends, { name: 'N/A' })
      ? localLegends.push(defaultObj[notApplicableIndex])
      : localLegends;
    return localLegends;
  }

  onSetCurrentLegendSet(legendSet: LegendSet, event) {
    event.stopPropagation();
    this.currentLegendSet =
      legendSet && legendSet.id
        ? legendSet.id === this.currentLegendSet
          ? ''
          : legendSet.id
        : this.currentLegendSet;
  }

  addNewLegend(event, legendSetId) {
    event.stopPropagation();
    this.legendSets = _.forEach(this.legendSets, legendSet => {
      if (legendSet.id === legendSetId) {
        const { legends } = legendSet;
        const legend: Legend = legendHelper.getNewLegend(legends);
        legendSet.legends = _.sortBy([...legends, legend], 'startValue');
      }
    });
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  saveConfigurations(event) {
    event.stopPropagation();
    this.legendSetConfigurationClose.emit(this.legendSets);
  }

  ngOnDestroy() {}
}
