import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeriodFilterConfig } from '@iapps/ngx-dhis2-period-filter';
import * as _ from 'lodash';

import { SELECTION_FILTER_CONFIG } from '../../constants/selection-filter-config.constant';
import {
  ARROW_DOWN_ICON,
  ARROW_LEFT_ICON,
  ARROW_RIGHT_ICON,
  DATA_ICON,
  FILTER_ICON,
  PERIOD_ICON,
  TREE_ICON,
} from '../../icons';
import { SelectionFilterConfig } from '../../models/selected-filter-config.model';
import { MatDialog } from '@angular/material/dialog';
import { SelectionFilterDialogComponent } from '../../components/selection-filter-dialog/selection-filter-dialog.component';
import { SelectionDialogData } from '../../models/selection-dialog-data.model';
import { DEFAULT_LEGEND_DEFINITIONS } from 'src/app/dashboard/constants/default-legend-definitions.constant';
import { OrgUnitFilterConfig } from '@iapps/ngx-dhis2-org-unit-filter';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-selection-filters',
  templateUrl: './selection-filters.component.html',
  styleUrls: ['./selection-filters.component.css'],
})
export class SelectionFiltersComponent implements OnInit {
  @Input()
  dataSelections: any[];

  @Input()
  layout: any;
  @Input()
  selectionFilterConfig: SelectionFilterConfig;

  @Input()
  currentUserHasAuthorities: boolean;

  @Input()
  saving: boolean;

  periodFilterConfig: PeriodFilterConfig;
  orgUnitFilterConfig: OrgUnitFilterConfig;
  @Output()
  filterUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();

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
  selectedFilter: string;

  constructor(private dialog: MatDialog) {
    this.showFilters = true;
    this.showFilterBody = false;

    // icons initializations
    this.filterIcon = FILTER_ICON;
    this.arrowLeftIcon = ARROW_LEFT_ICON;
    this.arrowRightIcon = ARROW_RIGHT_ICON;
    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.dataIcon = DATA_ICON;
    this.periodIcon = PERIOD_ICON;
    this.orgUnitIcon = TREE_ICON;

    this.periodFilterConfig = { singleSelection: true, emitOnDestroy: false };
    this.orgUnitFilterConfig = { singleSelection: true, closeOnDestroy: false };
  }

  get selectedData(): any[] {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject ? dataObject.items : [];
  }

  get generalDataConfiguration(): any {
    const dataObject = _.find(this.dataSelections, ['dimension', 'dx']);
    return dataObject
      ? {
          useShortNameAsLabel: dataObject.useShortNameAsLabel,
          legendDefinitions:
            dataObject.legendDefinitions || DEFAULT_LEGEND_DEFINITIONS,
        }
      : {
          useShortNameAsLabel: true,
          legendDefinitions: DEFAULT_LEGEND_DEFINITIONS,
        };
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
          layout: dataSelection.layout,
        };
      }),
      'layout'
    );
  }

  get filterConfig(): SelectionFilterConfig {
    return {
      ...SELECTION_FILTER_CONFIG,
      ...(this.selectionFilterConfig || {}),
    };
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
    if (this.selectedFilter === selectedFilter) {
      this.selectedFilter = '';
      this.showFilterBody = false;
    } else {
      this.selectedFilter = selectedFilter;
      this.showFilterBody = true;
    }

    const selectionDialogData: SelectionDialogData = {
      selectedFilter,
      selectedData: this.selectedData,
      selectedDataGroups: this.selectedDataGroups,
      selectedOrgUnits: this.selectedOrgUnits,
      selectedPeriods: this.selectedPeriods,
      periodFilterConfig: this.periodFilterConfig,
      orgUnitFilterConfig: this.orgUnitFilterConfig,
      generalDataConfiguration: this.generalDataConfiguration,
    };

    const width = selectedFilter === 'DATA' ? '95%' : '800px';
    const height = selectedFilter === 'DATA' ? '87vh' : '600px';

    const selectionDialog = this.dialog.open(SelectionFilterDialogComponent, {
      width,
      height,
      data: selectionDialogData,
    });

    selectionDialog.afterClosed().subscribe((dialogData: any) => {
      if (dialogData.action === 'UPDATE') {
        this.onFilterUpdate(dialogData.selectionItems);
      } else {
        this.onFilterClose(dialogData.selectionItems);
      }
    });
  }

  onClickOutside() {
    this.selectedFilter = '';
    this.showFilterBody = false;
  }

  onFilterClose(selectedItems) {
    if (selectedItems && selectedItems.items.length > 0) {
      this.dataSelections = !_.find(this.dataSelections, [
        'dimension',
        selectedItems.dimension,
      ])
        ? [...this.dataSelections, { ...selectedItems, layout: 'columns' }]
        : [
            ...this.updateDataSelectionWithNewSelections(
              this.dataSelections,
              selectedItems
            ),
          ];
    }
  }

  onFilterUpdate(selectedItems) {
    this.dataSelections = !_.find(this.dataSelections, [
      'dimension',
      selectedItems.dimension,
    ])
      ? [...this.dataSelections, { ...selectedItems, layout: 'rows' }]
      : [
          ...this.updateDataSelectionWithNewSelections(
            this.dataSelections,
            selectedItems
          ),
        ];

    this.filterUpdate.emit(this.dataSelections);
    this.selectedFilter = '';
    this.showFilterBody = false;
  }

  updateDataSelectionWithNewSelections(
    dataSelections: any[],
    selectedObject: any
  ): any[] {
    const selectedDimension = _.find(dataSelections, [
      'dimension',
      selectedObject.dimension,
    ]);
    const selectedDimensionIndex = selectedDimension
      ? dataSelections.indexOf(selectedDimension)
      : -1;
    return selectedDimension
      ? [
          ...dataSelections.slice(0, selectedDimensionIndex),
          { ...selectedDimension, ...selectedObject },
          ...dataSelections.slice(selectedDimensionIndex + 1),
        ]
      : dataSelections
      ? [...dataSelections, selectedObject]
      : [selectedObject];
  }
}
