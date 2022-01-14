import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeriodFilterConfig } from '@iapps/ngx-dhis2-period-filter';
import * as _ from 'lodash';
import { DEFAULT_LEGEND_DEFINITIONS } from 'src/app/dashboard/constants/default-legend-definitions.constant';

import { SelectionFilterDialogComponent } from '../../components/selection-filter-dialog/selection-filter-dialog.component';
import { SELECTION_FILTER_CONFIG } from '../../constants/selection-filter-config.constant';
import { SelectionFilterConfig } from '../../models/selected-filter-config.model';
import { SelectionDialogData } from '../../models/selection-dialog-data.model';
import { VisualizationDataSelection } from '../../../ngx-dhis2-visualization/models';
import { Fn } from '@iapps/function-analytics';
import { SystemInfo } from '@iapps/ngx-dhis2-http-client';
import { OrgUnitFilterConfig } from 'src/app/ngx-dhis2-org-unit-filter/models/org-unit-filter-config.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-selection-filters',
  templateUrl: './selection-filters.component.html',
  styleUrls: ['./selection-filters.component.css'],
})
export class SelectionFiltersComponent implements OnInit {
  @Input() dataSelections: any[];
  @Input() layout: any;
  @Input() selectionFilterConfig: SelectionFilterConfig;
  @Input() currentUserHasAuthorities: boolean;
  @Input() saving: boolean;
  @Input() userAccesses: any[];
  @Input() userGroupAccesses: any[];
  @Input() publicAccess: string;
  @Input() bottleneckPeriodType: string;
  @Input() interventionName: string;
  @Input() systemInfo: SystemInfo;

  periodFilterConfig: PeriodFilterConfig;
  orgUnitFilterConfig: OrgUnitFilterConfig;
  showFilters: boolean;
  showFilterBody: boolean;
  selectedFilter: string;

  @Output() filterUpdate: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() interventionSettingsUpdate: EventEmitter<any> = new EventEmitter<
    any
  >();

  constructor(private dialog: MatDialog) {
    this.showFilters = true;
    this.showFilterBody = false;
    this.periodFilterConfig = {
      singleSelection: true,
      emitOnDestroy: false,
      disablePeriodTypeSelection: true,
      allowDateRangeSelection: false,
      allowFixedPeriodSelection: false,
      allowRelativePeriodSelection: false,
    };
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
      _.map(this.dataSelections, (dataSelection) => {
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
      selectedDataGroups: _.sortBy(this.selectedDataGroups, 'sortOrder'),
      selectedOrgUnits: this.selectedOrgUnits,
      selectedPeriods: this.selectedPeriods,
      periodFilterConfig: this.periodFilterConfig,
      orgUnitFilterConfig: this.orgUnitFilterConfig,
      generalDataConfiguration: this.generalDataConfiguration,
      userAccesses: this.userAccesses.map((userAccess: any) => ({
        ...userAccess,
        type: 'user',
      })),
      userGroupAccesses: this.userGroupAccesses.map((userGroupAccess: any) => ({
        ...userGroupAccess,
        type: 'userGroup',
      })),
      publicAccess: this.publicAccess,
      bottleneckPeriodType: this.bottleneckPeriodType,
      interventionName: this.interventionName,
    };

    const width = selectedFilter === 'DATA' ? '95%' : '800px';
    const height = selectedFilter === 'DATA' ? '87vh' : '600px';

    const selectionDialog = this.dialog.open(SelectionFilterDialogComponent, {
      width,
      height,
      data: selectionDialogData,
    });

    selectionDialog.afterClosed().subscribe((dialogData: any) => {
      this.interventionSettingsUpdate.emit({
        bottleneckPeriodType: dialogData.bottleneckPeriodType,
        ...dialogData.sharingDetails,
      });
      if (dialogData.action === 'UPDATE') {
        this.onFilterUpdate(
          dialogData.selectionItems,
          dialogData.bottleneckPeriodType
        );
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

  onFilterUpdate(
    selectedItems: VisualizationDataSelection,
    bottleneckPeriodType: string
  ) {
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

    if (selectedItems.dimension === 'dx') {
      const periodDataSelection = (this.dataSelections || []).find(
        (dataSelection: VisualizationDataSelection) =>
          dataSelection.dimension === 'pe'
      );

      const isValidPeriodBasedOnBottleneckPeriodType = (periodDataSelection
        ? periodDataSelection.items
        : []
      ).some((periodItem: any) => periodItem.type === bottleneckPeriodType);

      if (!isValidPeriodBasedOnBottleneckPeriodType) {
        const periodInstance = new Fn.Period();

        periodInstance
          .setType(bottleneckPeriodType)
          .setCalendar(this.systemInfo.keyCalendar)
          .get();
        let periodList = periodInstance.list();
        let selectedPeriod = null;

        if (periodList.length === 0) {
          periodInstance.setYear(periodInstance.currentYear() - 1).get();

          periodList = periodInstance.list();

          selectedPeriod =
            periodList && periodList[0]
              ? _.pick(periodList[0], ['id', 'name', 'type'])
              : null;
        } else {
          if (bottleneckPeriodType.indexOf('Relative') !== -1) {
            selectedPeriod = (periodList || []).filter(
              (period: any) => period.id.indexOf('THIS_') !== -1
            )[0];
          } else {
            selectedPeriod =
              periodList && periodList[0]
                ? {
                    ...periodList[0].lastPeriod,
                    type: periodList[0].type,
                  }
                : null;
          }
        }

        if (selectedPeriod) {
          this.dataSelections = this.dataSelections.map(
            (dataSelection: VisualizationDataSelection) => {
              if (dataSelection.dimension === 'pe') {
                return {
                  ...dataSelection,
                  items: [
                    {
                      id: selectedPeriod.id,
                      name: selectedPeriod.name,
                      type: selectedPeriod.type,
                    },
                  ],
                };
              }

              return dataSelection;
            }
          );
        }
      }
    }

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
