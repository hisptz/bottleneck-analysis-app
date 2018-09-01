import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';
import * as _ from 'lodash';
import { Subscription, Observable, of } from 'rxjs';

import { DataFilterService } from '../../services/data-filter.service';
import * as fromIcons from '../../icons';
import * as fromConstants from '../../constants';
import * as fromModels from '../../models';
import * as fromHelpers from '../../helpers';

import * as fromDataFilterReducer from '../../store/reducers/data-filter.reducer';
import * as fromDataFilterActions from '../../store/actions/data-filter.actions';
import * as fromDataFilterSelectors from '../../store/selectors/data-filter.selectors';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css']
})
export class DataFilterComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  availableItems: any[] = [];
  dataGroups: any[] = [];
  selectedGroup: any = { id: 'all', name: '[ All ]' };

  @Output()
  dataFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  dataFilterClose: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  selectedItems: any[] = [];
  @Input()
  selectedGroups: any[] = [];
  @Input()
  functionMappings: any[] = [];
  @Input()
  hiddenDataElements: any[] = [];
  @Input()
  singleSelection = false;

  @Input()
  dataFilterPreferences: { enabledSelections: string[] };
  selectedGroupId: string;

  showGroupingPanel: boolean;
  private _selectedItems: any[];
  selectedItems$: Observable<any>;
  querystring: string = null;
  dataItemSearchTerm: string;
  showBody = false;
  dataItems: any = {
    dataElements: [],
    indicators: [],
    dataElementGroups: [],
    indicatorGroups: [],
    categoryOptions: [],
    dataSets: [],
    programs: [],
    programIndicators: [],
    dataSetGroups: [
      { id: '', name: 'Reporting Rate' },
      { id: '.REPORTING_RATE_ON_TIME', name: 'Reporting Rate on time' },
      { id: '.ACTUAL_REPORTS', name: 'Actual Reports Submitted' },
      { id: '.ACTUAL_REPORTS_ON_TIME', name: 'Reports Submitted on time' },
      { id: '.EXPECTED_REPORTS', name: 'Expected Reports' }
    ]
  };
  loading: boolean;
  p = 1;
  k = 1;
  need_groups: boolean;

  dataFilterSelections: fromModels.DataFilterSelection[];
  showGroups: boolean;

  hideMonth = false;
  hideQuarter = false;

  // icons
  listIcon: string;
  arrowLeftIcon: string;
  arrowRightIcon: string;

  dataFilterGroups$: Observable<any[]>;
  currentDataFilterGroup$: Observable<any>;
  dataFilterItems$: Observable<any[]>;

  constructor(
    private dataFilterService: DataFilterService,
    private dataFilterStore: Store<fromDataFilterReducer.State>
  ) {
    // Set default data filter preferences
    this.dataFilterPreferences = {
      enabledSelections: ['in', 'fn']
    };
    // Load data filter items
    dataFilterStore.dispatch(new fromDataFilterActions.LoadDataFilters());

    this.dataFilterGroups$ = dataFilterStore.select(
      fromDataFilterSelectors.getDataFilterGroups
    );

    this.currentDataFilterGroup$ = dataFilterStore.select(
      fromDataFilterSelectors.getCurrentDataFilterGroup
    );

    this.dataFilterItems$ = dataFilterStore.select(
      fromDataFilterSelectors.getDataFilterItems
    );

    this.showGroups = false;
    this.need_groups = true;
    this.loading = true;

    this.listIcon = fromIcons.LIST_ICON;
    this.arrowLeftIcon = fromIcons.ARROW_LEFT_ICON;
    this.arrowRightIcon = fromIcons.ARROW_RIGHT_ICON;

    this.showGroupingPanel = false;

    this.selectedGroups = [
      {
        id: `group_1`,
        name: `Untitled Group 1`,
        current: true,
        members: []
      }
    ];
  }

  ngOnInit() {
    // set data filter selections
    const enabledSelections = _.uniq([
      'all',
      ...this.dataFilterPreferences.enabledSelections
    ]);
    this.dataFilterSelections = _.filter(
      fromConstants.DATA_FILTER_SELECTIONS || [],
      (dataFilterSelection: fromModels.DataFilterSelection) => {
        if (
          !this.dataFilterPreferences ||
          !this.dataFilterPreferences.enabledSelections
        ) {
          return true;
        }

        return enabledSelections.indexOf(dataFilterSelection.prefix) !== -1;
      }
    );
    // set selected data group
    this.selectedGroupId = this.selectedGroups[0]
      ? this.selectedGroups[0].id
      : 'group_1';
    // TODO revamp period filter to accomodate more data dimensions criterion
    this.initiateData();
    this._selectedItems = [...this.selectedItems];
    this.selectedItems$ = of(this._selectedItems);
  }

  // trigger this to reset pagination pointer when search change
  searchChanged() {
    this.p = 1;
  }

  initiateData() {
    this.subscription = this.dataFilterService
      .initiateData()
      .subscribe(items => {
        this.dataItems = Object.assign(
          {},
          {
            dataElements: items[0],
            indicators: items[1],
            dataElementGroups: items[3],
            indicatorGroups: items[2],
            categoryOptions: items[5],
            dataSets: items[4],
            programs: items[6],
            programIndicators: items[7],
            functions: items[8],
            dataSetGroups: [
              { id: '', name: 'Reporting Rate' },
              { id: '.REPORTING_RATE_ON_TIME', name: 'Reporting Rate on time' },
              { id: '.ACTUAL_REPORTS', name: 'Actual Reports Submitted' },
              {
                id: '.ACTUAL_REPORTS_ON_TIME',
                name: 'Reports Submitted on time'
              },
              { id: '.EXPECTED_REPORTS', name: 'Expected Reports' }
            ]
          }
        );
        this.loading = false;
        this.dataGroups = this.groupList();
        this.availableItems = this.dataItemList(
          this._selectedItems,
          this.selectedGroup
        );

        // /**
        //  * Detect changes manually
        //  */
        // this.changeDetector.detectChanges();
      });
  }

  setSelectedGroup(group, listArea, event) {
    event.stopPropagation();
    this.dataItemSearchTerm = '';
    this.selectedGroup = { ...group };
    this.availableItems = this.dataItemList(this._selectedItems, group);
    this.showGroups = false;
    this.p = 1;
    listArea.scrollTop = 0;
  }

  onSetDataFilterGroup(dataFilterGroup: any, e) {
    e.stopPropagation();
    this.dataFilterStore.dispatch(
      new fromDataFilterActions.SetCurrentDataFilterGroup(dataFilterGroup.id)
    );
    this.showGroups = false;
  }

  getSelectedOption(): any[] {
    const someArr = [];
    this.dataFilterSelections.forEach(val => {
      if (val.selected) {
        someArr.push(val);
      }
    });
    return _.map(someArr, 'prefix');
  }

  // get data Items data_element, indicators, dataSets
  getDataItems() {
    const dataElements = [];
    this.dataItems.dataElements.forEach(dataelement => {
      dataElements.push(...this.getDetailedDataElements(dataelement));
    });
    return {
      de: dataElements,
      in: this.dataItems.indicators,
      ds: this.dataItems.dataSets,
      pi: this.dataItems.programIndicators,
      rl: _.flatten(
        _.map(this.dataItems.functions, functionObject =>
          _.map(functionObject.rules || [], (rule: any) => {
            return {
              id: rule.id,
              name: rule.name,
              ruleDefinition: rule,
              functionObject: {
                id: functionObject.id,
                functionString: functionObject.function
              },
              type: 'FUNCTION_RULE'
            };
          })
        )
      )
    };
  }

  // this function helps you to get the detailed metadata
  getDetailedDataElements(dataElement) {
    const dataElements = [];
    const categoryCombo = this.getCategoryCombo(dataElement.categoryCombo.id);

    dataElements.push({
      dataElementId: dataElement.id,
      id: dataElement.id,
      name: dataElement.name + '',
      dataSetElements: dataElement.dataSetElements
    });

    categoryCombo.categoryOptionCombos.forEach(option => {
      if (option.name !== 'default') {
        dataElements.push({
          dataElementId: dataElement.id,
          id: dataElement.id + '.' + option.id,
          name: dataElement.name + ' ' + option.name,
          dataSetElements: dataElement.dataSetElements
        });
      }
    });

    return dataElements;
  }

  // Helper to get the data elements option
  getCategoryCombo(uid): any {
    let category = null;
    this.dataItems.categoryOptions.forEach(val => {
      if (val.id === uid) {
        category = val;
      }
    });
    return category;
  }

  // Helper function to get data groups
  getData() {
    return {
      dx: this.dataItems.dataElementGroups,
      in: this.dataItems.indicatorGroups,
      ds: this.dataItems.dataSetGroups,
      pr: this.dataItems.programs,
      fn: this.dataItems.functions
    };
  }

  // get the data list do display
  dataItemList(selectedItems, group) {
    const currentList = [];
    const selectedOptions = this.getSelectedOption();
    const data: any = this.getDataItems();

    // check if data element is in a selected group
    if (
      _.includes(selectedOptions, 'all') ||
      _.includes(selectedOptions, 'de')
    ) {
      if (group.id === 'all') {
        currentList.push(...data.de);
      } else {
        if (group.hasOwnProperty('dataElements')) {
          const newArray = _.filter(data.de, dataElement => {
            return _.includes(
              _.map(group.dataElements, 'id'),
              dataElement.dataElementId
            );
          });
          currentList.push(...newArray);
        }
      }
    }

    // check if data indicators are in a selected group
    if (
      _.includes(selectedOptions, 'all') ||
      _.includes(selectedOptions, 'in')
    ) {
      if (group.id === 'all') {
        currentList.push(...data.in);
      } else {
        if (group.hasOwnProperty('indicators')) {
          const newArray = _.filter(data.in, indicator => {
            return _.includes(_.map(group.indicators, 'id'), indicator['id']);
          });
          currentList.push(...newArray);
        }
      }
    }

    // check if data data sets are in a selected group
    if (
      _.includes(selectedOptions, 'all') ||
      _.includes(selectedOptions, 'ds')
    ) {
      if (group.id === 'all') {
        this.dataItems.dataSetGroups.forEach(groupObject => {
          currentList.push(
            ...data.ds.map(datacv => {
              return {
                id: datacv.id + groupObject.id,
                name: groupObject.name + ' ' + datacv.name
              };
            })
          );
        });
      } else if (
        !group.hasOwnProperty('indicators') &&
        !group.hasOwnProperty('dataElements')
      ) {
        currentList.push(
          ...data.ds.map(datacv => {
            return {
              id: datacv.id + group.id,
              name: group.name + ' ' + datacv.name
            };
          })
        );
      }
    }
    // check if program
    if (
      _.includes(selectedOptions, 'all') ||
      _.includes(selectedOptions, 'pr')
    ) {
      if (group.id === 'all') {
        currentList.push(...data.pi);
      } else {
        if (group.hasOwnProperty('programIndicators')) {
          const newArray = _.filter(data.pi, indicator => {
            return _.includes(
              _.map(group.programIndicators, 'id'),
              indicator['id']
            );
          });
          currentList.push(...newArray);
        }
      }
    }

    if (
      _.includes(selectedOptions, 'all') ||
      _.includes(selectedOptions, 'fn')
    ) {
      if (group.id === 'all') {
        currentList.push(...data.rl);
      } else {
        if (group.hasOwnProperty('rules')) {
          const newArray = _.filter(data.rl, functionRule => {
            return _.includes(_.map(group.rules, 'id'), functionRule['id']);
          });
          currentList.push(...newArray);
        }
      }
    }

    const currentListWithOutHiddenItems = _.filter(currentList, item => {
      return !_.includes(this.hiddenDataElements, item['id']);
    });

    return _.sortBy(
      _.filter(
        currentListWithOutHiddenItems,
        (item: any) => !_.find(selectedItems, ['id', item.id])
      ),
      ['name']
    );
  }

  // Get group list to display
  groupList() {
    this.need_groups = true;
    const currentGroupList = [];
    const options = this.getSelectedOption();
    const data = this.getData();

    if (_.includes(options, 'all') || _.includes(options, 'de')) {
      currentGroupList.push(...data.dx);
    }

    if (_.includes(options, 'all') || _.includes(options, 'in')) {
      if (options.length === 1 && _.includes(options, 'in')) {
        currentGroupList.push(...data.in);
      } else {
        currentGroupList.push(
          ...data.in.map(indicatorGroup => {
            return {
              id: indicatorGroup.id,
              name: indicatorGroup.name + ' - Computed',
              indicators: indicatorGroup.indicators
            };
          })
        );
      }
    }

    if (_.includes(options, 'all') || _.includes(options, 'pr')) {
      currentGroupList.push(...data.pr);
    }

    if (_.includes(options, 'all') || _.includes(options, 'ds')) {
      currentGroupList.push(...data.ds);
    }

    if (_.includes(options, 'all') || _.includes(options, 'fn')) {
      currentGroupList.push(...data.fn);
    }

    if (_.includes(options, 'ds')) {
      this.need_groups = false;
    }

    return [
      { id: 'all', name: '[ All ]' },
      ..._.sortBy(currentGroupList, ['name'])
    ];
  }

  // this will add a selected item in a list function
  onSelectDataItem(item: any, e) {
    e.stopPropagation();
    if (this.singleSelection) {
      this.onDeselectAllItems();
    }

    if (!_.find(this.selectedItems, ['id', item.id])) {
      this.selectedItems = [...this.selectedItems, item];
    }
  }

  // Remove selected Item
  onRemoveDataItem(dataItem: any, event) {
    event.stopPropagation();
    const itemIndex = this.selectedItems.indexOf(dataItem);

    if (itemIndex !== -1) {
      this.selectedItems = [
        ...this.selectedItems.slice(0, itemIndex),
        ...this.selectedItems.slice(itemIndex + 1)
      ];
    }
  }

  getAutogrowingTables(selections) {
    const autogrowings = [];
    selections.forEach(value => {
      if (value.hasOwnProperty('programType')) {
        autogrowings.push(value);
      }
    });
    return autogrowings;
  }

  getFunctions(selections) {
    const mappings = [];
    selections.forEach(value => {
      const dataElementId = value.id.split('.');
      this.functionMappings.forEach(mappedItem => {
        const mappedId = mappedItem.split('_');
        if (dataElementId[0] === mappedId[0]) {
          mappings.push({ id: value.id, func: mappedId[1] });
        }
      });
    });
    return mappings;
  }

  // selecting all items
  onSelectAllItems(event) {
    event.stopPropagation();

    this.dataFilterItems$
      .pipe(
        map((dataFilterItems: any[]) =>
          fromHelpers.filterByName(dataFilterItems, this.dataItemSearchTerm)
        ),
        take(1)
      )
      .subscribe((dataFilterItems: any[]) => {
        console.log(dataFilterItems.length);
        this.selectedItems = _.uniqBy(
          [...this.selectedItems, ...dataFilterItems],
          'id'
        );
      });
  }

  // selecting all items
  onDeselectAllItems(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.selectedItems = [];
  }

  // Check if item is in selected list
  inSelected(item, list) {
    let checker = false;
    for (const per of list) {
      if (per.id === item.id) {
        checker = true;
      }
    }
    return checker;
  }

  // action that will fire when the sorting of selected data is done
  transferDataSuccess(data, current) {
    if (data.dragData.id === current.id) {
      console.log('Droping in the same area');
    } else {
      const number =
        this.getDataPosition(data.dragData.id) >
        this.getDataPosition(current.id)
          ? 0
          : 1;
      this.deleteData(data.dragData);
      this.insertData(data.dragData, current, number);
    }
  }

  emit(e) {
    e.stopPropagation();
    this.dataFilterUpdate.emit({
      items: this._selectedItems,
      groups: this.selectedGroups,
      dimension: 'dx'
    });
  }

  // helper method to find the index of dragged item
  getDataPosition(dataId) {
    let dataIndex = null;
    this._selectedItems.forEach((data, index) => {
      if (data.id === dataId) {
        dataIndex = index;
      }
    });
    return dataIndex;
  }

  // help method to delete the selected Data in list before inserting it in another position
  deleteData(dataToDelete) {
    this._selectedItems.forEach((data, dataIndex) => {
      if (dataToDelete.id === data.id) {
        this._selectedItems.splice(dataIndex, 1);
      }
    });

    this.selectedItems$ = of(this._selectedItems);
  }

  // Helper method to insert Data in new position after drag drop event
  insertData(Data_to_insert, current_Data, num: number) {
    this._selectedItems.forEach((Data, Data_index) => {
      if (
        current_Data.id === Data.id &&
        !this.checkDataAvailabilty(Data_to_insert, this._selectedItems)
      ) {
        this._selectedItems.splice(Data_index + num, 0, Data_to_insert);
      }
    });

    this.selectedItems$ = of(this._selectedItems);
  }

  // check if orgunit already exist in the orgunit display list
  checkDataAvailabilty(Data, array): boolean {
    let checker = false;
    for (const per of array) {
      if (per.id === Data.id) {
        checker = true;
      }
    }
    return checker;
  }

  getDataForAnalytics(selectedData) {
    let dataForAnalytics = '';
    let counter = 0;
    selectedData.forEach(dataValue => {
      const dataElementId = dataValue.id.split('.');
      if (dataValue.hasOwnProperty('programType')) {
      } else {
        let mapped = false;
        this.functionMappings.forEach(mappedItem => {
          const mappedId = mappedItem.split('_');
          if (dataElementId[0] === mappedId[0]) {
            mapped = true;
          }
        });
        if (mapped) {
        } else {
          dataForAnalytics += counter === 0 ? dataValue.id : ';' + dataValue.id;
          counter++;
        }
      }
    });
    return dataForAnalytics;
  }

  close(e) {
    e.stopPropagation();
    this.dataFilterClose.emit({
      items: this._selectedItems,
      groups: this.selectedGroups,
      dimension: 'dx'
    });
  }

  onToggleDataFilterSelection(toggledDataFilterSelection, event) {
    event.stopPropagation();
    const multipleSelection = event.ctrlKey ? true : false;
    this.dataFilterSelections = _.map(
      this.dataFilterSelections,
      (dataFilterSelection: any) => {
        return {
          ...dataFilterSelection,
          selected:
            toggledDataFilterSelection.prefix === 'all'
              ? dataFilterSelection.prefix !== 'all'
                ? false
                : !dataFilterSelection.selected
              : toggledDataFilterSelection.prefix === dataFilterSelection.prefix
                ? !dataFilterSelection.selected
                : multipleSelection
                  ? dataFilterSelection.prefix === 'all'
                    ? false
                    : dataFilterSelection.selected
                  : false
        };
      }
    );

    this.dataFilterStore.dispatch(
      new fromDataFilterActions.UpdateActiveDataFilterSelections(
        this.dataFilterSelections
      )
    );

    this.selectedGroup = { id: 'all', name: '[ All ]' };
    this.dataGroups = this.groupList();

    this.availableItems = this.dataItemList(
      this._selectedItems,
      this.selectedGroup
    );
    this.p = 1;
    this.dataItemSearchTerm = '';
  }

  toggleDataFilterGroupList(e) {
    e.stopPropagation();
    this.showGroups = !this.showGroups;
  }

  onToggleGroupingPanel(e) {
    e.stopPropagation();
    this.showGroupingPanel = !this.showGroupingPanel;
  }

  onDataGroupsUpdate(dataGroups) {
    this.selectedGroups = dataGroups;
  }

  onSelectedGroupUpdate(selectedGroupId: string) {
    this.selectedGroupId = selectedGroupId;
  }

  ngOnDestroy() {
    this.dataFilterClose.emit({
      items: this._selectedItems,
      groups: this.selectedGroups,
      dimension: 'dx'
    });
    this.subscription.unsubscribe();
  }
}
