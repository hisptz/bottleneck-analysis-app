import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { LegendSet, Legend } from '../../models/legend-set';
import * as _ from 'lodash';
import { DELETE_ICON } from '../../icons';
import * as legendHelper from '../../helpers';
@Component({
  selector: 'app-legend-set-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legend-set-container.component.html',
  styleUrls: ['./legend-set-container.component.css']
})
export class LegendSetContainerComponent implements OnInit, OnDestroy {
  @Input()
  selectedItems;
  @Input()
  legendSetEntities;
  @Input() legendSets: LegendSet[];
  @Input()
  visualizationLayerId: string;

  @Input() currentLegendSet: LegendSet;

  @Output()
  legendSetConfigurationClose = new EventEmitter();
  @Output()
  legendSetConfigurationUpdate = new EventEmitter();

  @Output()
  legendSetConfigOnDataStoreSave = new EventEmitter();

  @Output()
  legendSetConfigOnDelete = new EventEmitter();
  currentLegendSetId: string;
  legendUniqIdentifiers: string[];
  deleteIcon: string;
  legendSetName: string;
  legendStyles = ['color', 'pattern'];

  constructor() {
    this.deleteIcon = DELETE_ICON;
  }

  ngOnInit() {
    this.legendUniqIdentifiers = [legendHelper.getUniqueId()];
    const legendSets: LegendSet[] = legendHelper.getLegendSetsConfiguration(
      this.legendUniqIdentifiers,
      this.legendSetEntities,
      this.visualizationLayerId
    );
    this.currentLegendSet = this.currentLegendSet || legendSets[0];
    if (legendSets[0].legends && legendSets[0].legends.length) {
      this.currentLegendSetId = legendSets[0].id;
      this.legendSetConfigurationUpdate.emit(legendSets[0]);
    }
  }

  onSetCurrentLegendSet(legendSet: LegendSet) {
    if (legendSet) {
      this.currentLegendSet = legendSet;
      this.legendSetConfigurationUpdate.emit(this.currentLegendSet);
    }
  }

  addNewLegend(event) {
    event.stopPropagation();
    const { legends } = this.currentLegendSet;
    const legend: Legend = legendHelper.getNewLegend(legends);
    this.currentLegendSet.legends = _.sortBy([...legends, legend], 'startValue');
    this.legendSetConfigurationUpdate.emit(this.currentLegendSet);
  }

  trackByFn(index, item) {
    return item && item.id ? item.id : index;
  }

  onLegendSetUpdate(event) {
    this.legendSetConfigurationUpdate.emit(event);
  }

  onLegendSetSelectionClear() {
    this.legendUniqIdentifiers = [legendHelper.getUniqueId()];
    this.currentLegendSetId = undefined;
    this.currentLegendSet = legendHelper.getLegendSetsConfiguration(
      this.legendUniqIdentifiers,
      this.legendSetEntities,
      this.visualizationLayerId
    )[0];
  }

  closeConfigurations(event) {
    event.stopPropagation();
    this.legendSetConfigurationClose.emit();
  }

  saveCofigurations(event) {
    event.stopPropagation();
    const currentLegendSet = {
      ...this.currentLegendSet,
      legends: this.currentLegendSet.legends.map(item => ({
        ...item,
        startValue: Number(item.startValue) > 0 ? Number(item.startValue) : 0
      }))
    };
    this.legendSetConfigOnDataStoreSave.emit([currentLegendSet]);
  }

  deleteLegendSets(event) {
    event.stopPropagation();
    this.currentLegendSetId = undefined;
    const newEntities = Object.keys(this.legendSetEntities)
      .filter(key => key !== this.currentLegendSet.id)
      .reduce((res, key) => ((res[key] = this.legendSetEntities[key]), res), {});
    const legendSets: LegendSet[] = legendHelper.getLegendSetsConfiguration(
      this.legendUniqIdentifiers,
      newEntities,
      this.visualizationLayerId
    );
    this.legendSetConfigOnDelete.emit(this.currentLegendSet);
    this.currentLegendSet = legendSets[0];
  }

  onLegendSetNameUpdate() {
    // console.log(this.legendSets);
  }

  ngOnDestroy() {}
}
