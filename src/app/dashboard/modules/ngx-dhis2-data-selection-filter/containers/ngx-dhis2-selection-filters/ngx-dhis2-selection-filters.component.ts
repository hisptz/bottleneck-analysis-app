import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import * as _ from 'lodash';
import {
  FILTER_ICON,
  ARROW_LEFT_ICON,
  ARROW_RIGHT_ICON,
  DATA_ICON,
  PERIOD_ICON,
  ARROW_DOWN_ICON,
  TREE_ICON
} from '../../icons';
import { SelectionFilterConfig } from '../../models/selected-filter-config.model';
import { SELECTION_FILTER_CONFIG } from '../../constants/selection-filter-config.constant';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-selection-filters',
  templateUrl: './ngx-dhis2-selection-filters.component.html',
  styleUrls: ['./ngx-dhis2-selection-filters.component.css']
})
export class NgxDhis2SelectionFiltersComponent implements OnInit, OnChanges {
  @Input()
  dataSelections: any[];

  @Input()
  layout: any;
  @Input()
  selectionFilterConfig: SelectionFilterConfig;
  @Input()
  saving: boolean;

  @Input()
  currentUserHasAuthorities: boolean;

  @Output()
  filterUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output()
  save: EventEmitter<any> = new EventEmitter<any>();
  showFilters: boolean;
  showFilterBody: boolean;

  // icons
  filterIcon: string;
  arrowLeftIcon: string;
  arrowRightIcon: string;
  arrowDownIcon: string;
  dataIcon: string;
  periodIcon: string;
  orgUnitIcon: string;
  private _selectedFilter: string;

  constructor() {
    this.showFilters = this.showFilterBody = false;

    // icons initializations
    this.filterIcon = FILTER_ICON;
    this.arrowLeftIcon = ARROW_LEFT_ICON;
    this.arrowRightIcon = ARROW_RIGHT_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.dataIcon = DATA_ICON;
    this.periodIcon = PERIOD_ICON;
    this.orgUnitIcon = TREE_ICON;
  }

  get selectedData(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.items : [];
  }

  get selectedDataGroups(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.groups : [];
  }

  get selectedPeriods(): any[] {
    const periodObject = _.find(this.dataSelections, ['dimension', 'pe']);
    return periodObject ? periodObject.items : [];
  }

  get selectedOrgUnits(): any[] {
    const periodObject = _.find(this.dataSelections, ['dimension', 'ou']);
    return periodObject ? periodObject.items : [];
  }

  get selectedLegendSets(): any[] {
    return [];
  }

  get layoutItem(): any {
    return _.groupBy(
      _.map(this.dataSelections, dataSelection => {
        return {
          name: dataSelection.name,
          value: dataSelection.dimension,
          layout: dataSelection.layout
        };
      }),
      'layout'
    );
  }

  get filterConfig(): SelectionFilterConfig {
    return {
      ...SELECTION_FILTER_CONFIG,
      ...(this.selectionFilterConfig || {})
    };
  }

  get selectedFilter(): string {
    return this._selectedFilter;
  }

  ngOnChanges() {
    // TODO: FIND GENERIC WAY TO HANDLE AUTOHORITIES WHEN SELECTING CURRENT FILTER
    this._selectedFilter = this._selectedFilter
      ? this._selectedFilter === 'DATA' && !this.currentUserHasAuthorities
        ? this.filterConfig.showPeriodFilter
          ? 'PERIOD'
          : this.filterConfig.showOrgUnitFilter
          ? 'ORG_UNIT'
          : this.filterConfig.showLayout
          ? 'LAYOUT'
          : ''
        : this._selectedFilter
      : this.filterConfig.showDataFilter && this.currentUserHasAuthorities
      ? 'DATA'
      : this.filterConfig.showPeriodFilter
      ? 'PERIOD'
      : this.filterConfig.showOrgUnitFilter
      ? 'ORG_UNIT'
      : this.filterConfig.showLayout
      ? 'LAYOUT'
      : '';
  }

  ngOnInit() {}

  toggleFilters(e) {
    e.stopPropagation();
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showFilterBody = true;
    } else {
      this.showFilterBody = false;
    }
  }

  toggleCurrentFilter(e, selectedFilter) {
    e.stopPropagation();
    if (this._selectedFilter === selectedFilter) {
      this._selectedFilter = '';
      this.showFilterBody = false;
    } else {
      this._selectedFilter = selectedFilter;
      this.showFilterBody = true;
    }
  }

  onClickOutside() {
    this._selectedFilter = '';
    this.showFilterBody = false;
  }

  onFilterClose(selectedItems, selectedFilter) {
    if (selectedItems && selectedItems.items.length > 0) {
      this.dataSelections = !_.find(this.dataSelections, [
        'dimension',
        selectedItems.dimension
      ])
        ? [...this.dataSelections, { ...selectedItems, layout: 'columns' }]
        : [
            ...this.updateDataSelectionWithNewSelections(
              this.dataSelections,
              selectedItems
            )
          ];
    }

    if (this.selectedFilter === selectedFilter) {
      this.showFilterBody = false;
    }
  }

  onFilterUpdate(selectedItems, selectedFilter) {
    this.dataSelections = !_.find(this.dataSelections, [
      'dimension',
      selectedItems.dimension
    ])
      ? [...this.dataSelections, { ...selectedItems, layout: 'rows' }]
      : [
          ...this.updateDataSelectionWithNewSelections(
            this.dataSelections,
            selectedItems
          )
        ];

    this.filterUpdate.emit(this.dataSelections);
    this._selectedFilter = '';
    this.showFilterBody = false;
  }

  onSave(e) {
    e.stopPropagation();
    this._selectedFilter = '';
    this.showFilterBody = false;
    this.save.emit(null);
  }

  updateDataSelectionWithNewSelections(
    dataSelections: any[],
    selectedObject: any
  ): any[] {
    const selectedDimension = _.find(dataSelections, [
      'dimension',
      selectedObject.dimension
    ]);
    const selectedDimensionIndex = selectedDimension
      ? dataSelections.indexOf(selectedDimension)
      : -1;
    return selectedDimension
      ? [
          ...dataSelections.slice(0, selectedDimensionIndex),
          { ...selectedDimension, ...selectedObject },
          ...dataSelections.slice(selectedDimensionIndex + 1)
        ]
      : dataSelections
      ? [...dataSelections, selectedObject]
      : [selectedObject];
  }
}
