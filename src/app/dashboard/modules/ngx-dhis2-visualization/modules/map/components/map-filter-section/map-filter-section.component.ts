import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { getDimensionItems } from '../../utils/analytics';
import * as fromStore from '../../store';

@Component({
  selector: 'app-map-filter-section',
  templateUrl: './map-filter-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  @Input() loaded = true;

  showFilters: boolean;
  selectedFilter = 'ORG_UNIT';
  selectedDataItems: any = [];
  selectedPeriods: any = [];
  selectedOrgUnitItems: any = [];
  selectedLayer;
  public legendSets$;
  public singleSelection = true;
  public isFilterSectionLoading$: Observable<boolean>;
  public isFilterSectionUpdated$: Observable<boolean>;
  public periodConfig: any = {
    singleSelection: true
  };
  public orgUnitFilterConfig = {
    closeOnDestroy: false
  };

  constructor(private store: Store<fromStore.MapState>) {}

  ngOnInit() {
    this.showFilters = true;
    const { layers, componentId } = this.mapVisualizationObject;
    this.selectedLayer = layers[this.activeLayer];
    const { dataSelections } = this.selectedLayer;
    this.getSelectedFilters(dataSelections);
    this.legendSets$ = this.store.select(fromStore.getAllLegendSets);
    this.isFilterSectionLoading$ = this.store.select(fromStore.isVisualizationLegendFilterSectionLoding(componentId));
    this.isFilterSectionUpdated$ = this.store.select(
      fromStore.isVisualizationLegendFilterSectionJustUpdated(componentId)
    );
  }

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    this.store.dispatch(new fromStore.ToggleVisualizationLegendFilterSection(this.mapVisualizationObject.componentId));
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    this.selectedFilter = selectedFilter;
  }

  onFilterUpdateAction(filterValue: any, filterType: string) {
    const { layers, componentId } = this.mapVisualizationObject;
    const layer = layers[this.activeLayer];
    const { value, items } = filterValue;

    // TODO: Refactor all these switch statements.

    switch (filterType) {
      case 'ORG_UNIT':
        const _items = items.map(item => ({ displayName: item.name, dimensionItem: item.id }));
        const newdimension = {
          dimension: 'ou',
          items: _items
        };
        const payload = {
          componentId,
          filterType: 'ou',
          layer,
          newdimension,
          params: value || items.map(item => item.id || item.dimensionItem).join(';')
        };
        this.store.dispatch(new fromStore.UpdateOUSelection(payload));
        break;
      case 'PERIOD':
        const peItems = items.map(item => ({
          displayName: item.name,
          dimensionItem: item.id,
          type: item.type,
          dimensionItemType: 'PERIOD'
        }));
        const newPeDimension = {
          dimension: 'pe',
          items: peItems
        };
        this.store.dispatch(
          new fromStore.UpdatePESelection({
            componentId,
            filterType: 'pe',
            layer,
            newdimension: newPeDimension,
            params: value
          })
        );
        break;
      case 'DATA':
        const dxItems = filterValue.itemList.map(item => ({
          displayName: item.name,
          dimensionItem: item.id
        }));
        const newDxDimension = {
          dimension: 'dx',
          items: dxItems
        };
        this.store.dispatch(
          new fromStore.UpdateDXSelection({
            componentId,
            filterType: 'dx',
            layer,
            newdimension: newDxDimension,
            params: filterValue.selectedData.value
          })
        );
        break;
      default:
        break;
    }
  }

  onStyleFilterUpdate({ layer }) {
    const { layers } = this.mapVisualizationObject;
    const updatedLayers = layers.map((_layer, index) => (index === this.activeLayer ? layer : _layer));
    this.store.dispatch(new fromStore.UpdateLayerStyle({ ...this.mapVisualizationObject, layers: updatedLayers }));
  }

  onFilterClose(event) {
    this.store.dispatch(new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId));
  }

  getSelectedFilters(dataSelections) {
    const { columns, rows, filters } = dataSelections;
    const data = [...columns, ...filters, ...rows];
    const selectedPeriods = getDimensionItems('pe', data);
    const selectedDataItems = getDimensionItems('dx', data);

    this.selectedPeriods = selectedPeriods.map(periodItem => ({
      id: periodItem.dimensionItem,
      name: periodItem.displayName,
      type: periodItem.dimensionItemType
    }));

    this.selectedOrgUnitItems = getDimensionItems('ou', data);
  }

  ngOnDestroy() {
    this.store.dispatch(new fromStore.CloseVisualizationLegendFilterSection(this.mapVisualizationObject.componentId));
  }
}
