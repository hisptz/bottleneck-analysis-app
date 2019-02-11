import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { LegendSet } from './models/legend-set';
import { Store, select } from '@ngrx/store';
import { MapState, getLegendSetsEntities, getAllLegendSetConfigs, getCurrentLegendSet } from '../../store';
import { Observable } from 'rxjs';
import * as legendSetHelper from './helpers/legend-set-helper';
import {
  UpsetLagendSets,
  DeleteLegendSet,
  SaveLagendSetsDataStore
} from '../../store/actions/legend-set-config.action';

@Component({
  selector: 'app-legend-set-configuration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legend-set-configuration.component.html',
  styleUrls: ['./legend-set-configuration.component.css']
})
export class LegendSetConfigurationComponent implements OnInit, OnDestroy {
  @Input()
  selectedItems;
  @Input()
  visualizationLayerId: string;

  @Output()
  legendSetConfigurationClose = new EventEmitter();
  @Output()
  legendSetOnUpdate = new EventEmitter();
  legendSetEntities$: Observable<any>;
  currentLegendSet$: Observable<any>;
  allLegendSets$: Observable<any>;

  constructor(private store: Store<MapState>) {
    this.legendSetEntities$ = store.pipe(select(getLegendSetsEntities));
    this.allLegendSets$ = store.pipe(select(getAllLegendSetConfigs));
    this.currentLegendSet$ = store.pipe(select(getCurrentLegendSet));
  }

  ngOnInit() {}

  onLegendSetConfigurationUpdate(legendSet: LegendSet) {
    this.legendSetOnUpdate.emit(legendSet);
    this.store.dispatch(new UpsetLagendSets({ legendSets: [legendSet] }));
  }

  onLegendSetConfigurationClose() {
    this.legendSetConfigurationClose.emit({
      items: this.selectedItems,
      groups: [],
      dimension: 'dx'
    });
  }

  onlegendSetConfigOnDataStoreSave(legendSets: LegendSet[]) {
    this.store.dispatch(new SaveLagendSetsDataStore({ legendSets }));
  }

  legendSetConfigOnDelete(legendSet: LegendSet) {
    this.store.dispatch(new DeleteLegendSet(legendSet));
  }

  ngOnDestroy() {}
}
