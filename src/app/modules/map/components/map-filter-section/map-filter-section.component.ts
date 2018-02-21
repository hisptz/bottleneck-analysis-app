import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as fromStore from '../../store';

@Component({
  selector: 'app-map-filter-section',
  templateUrl: './map-filter-section.component.html',
  styleUrls: ['./map-filter-section.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class MapFilterSectionComponent implements OnInit, OnDestroy {
  @Input() mapVisualizationObject;
  @Input() activeLayer;
  @Input() loaded: boolean = true;

  @Output() onFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLayoutUpdate: EventEmitter<any> = new EventEmitter<any>();

  showFilters: boolean;
  selectedFilter: string = 'ORG_UNIT';
  selectedDataItems: any = [];
  selectedPeriods: any = [];
  orgUnitModel: any = {
    selectionMode: 'orgUnit',
    selectedLevels: [],
    showUpdateButton: true,
    selectedGroups: [],
    orgUnitLevels: [],
    orgUnitGroups: [],
    selectedOrgUnits: [],
    userOrgUnits: [],
    type: 'report', // can be 'data_entry'
    selectedUserOrgUnits: []
  };

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.showFilters = true;
    // console.log(this.mapVisualizationObject);
  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    this.store.dispatch(
      new fromStore.ToggleVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

  onFilterUpdateAction(filterValue: any, filterType: string) {
    const activeLayerIndex = this.activeLayer;
    const { layers, componentId } = this.mapVisualizationObject;
    const layer = layers[activeLayerIndex];
    switch (filterType) {
      case 'ORG_UNIT':
        const { value } = filterValue;
        const payload = {
          componentId,
          layerId: layer['id'],
          params: value
        };
        this.store.dispatch(new fromStore.UpdateOUSelection(payload));
        break;
      case 'PERIOD':
        break;
      case 'DATA':

      default:
        break;
    }
    // this.onFilterUpdate.emit(filterValue);
  }

  onFilterClose(event) {
    this.store.dispatch(
      new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }

  ngOnDestroy() {
    this.store.dispatch(
      new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId)
    );
  }
}
