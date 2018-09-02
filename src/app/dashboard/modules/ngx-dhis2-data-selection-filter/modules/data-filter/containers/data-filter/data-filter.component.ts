import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';

import * as fromIcons from '../../icons';
import * as fromConstants from '../../constants';
import * as fromModels from '../../models';
import * as fromHelpers from '../../helpers';

import * as fromDataFilterReducer from '../../store/reducers/data-filter.reducer';
import * as fromDataFilterActions from '../../store/actions/data-filter.actions';
import * as fromDataFilterSelectors from '../../store/selectors/data-filter.selectors';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css']
})
export class DataFilterComponent implements OnInit, OnDestroy {
  dataGroups: any[] = [];

  @Output()
  dataFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  dataFilterClose: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  selectedItems: any[] = [];
  @Input()
  selectedGroups: any[] = [];

  @Input()
  dataFilterPreferences: {
    singleSelection: boolean;
    enabledSelections: string[];
  };

  @Input()
  dataGroupPreferences: {
    maximumNumberOfGroups: number;
    maximumItemPerGroup: number;
  };

  showGroupingPanel: boolean;
  selectedItems$: Observable<any>;
  querystring: string;
  dataItemSearchTerm: string;
  showBody = false;
  currentPageForAvailableDataItems = 1;
  currentPageForSelectedDataItems = 1;

  selectedGroupId: string;

  dataFilterSelections: fromModels.DataFilterSelection[];
  showGroups: boolean;

  // icons
  listIcon: string;
  arrowLeftIcon: string;
  arrowRightIcon: string;

  dataFilterGroups$: Observable<any[]>;
  currentDataFilterGroup$: Observable<any>;
  dataFilterItems$: Observable<any[]>;
  dataFilterLoading$: Observable<boolean>;

  constructor(private dataFilterStore: Store<fromDataFilterReducer.State>) {
    // Set default data filter preferences
    this.dataFilterPreferences = {
      enabledSelections: ['in', 'fn'],
      singleSelection: false
    };

    // Set default data group preferences
    this.dataGroupPreferences = {
      maximumNumberOfGroups: 6,
      maximumItemPerGroup: 3
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

    this.dataFilterLoading$ = dataFilterStore.select(
      fromDataFilterSelectors.getDataFilterLoadingStatus
    );

    this.showGroups = false;

    this.listIcon = fromIcons.LIST_ICON;
    this.arrowLeftIcon = fromIcons.ARROW_LEFT_ICON;
    this.arrowRightIcon = fromIcons.ARROW_RIGHT_ICON;

    this.showGroupingPanel = false;
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
  }

  // trigger this to reset pagination pointer when search change
  onDataItemsSearch(e) {
    e.stopPropagation();
    this.currentPageForAvailableDataItems = 1;
  }

  onSetDataFilterGroup(dataFilterGroup: any, e) {
    e.stopPropagation();
    this.dataFilterStore.dispatch(
      new fromDataFilterActions.SetCurrentDataFilterGroup(dataFilterGroup.id)
    );
    this.showGroups = false;
  }

  // this will add a selected item in a list function
  onSelectDataItem(item: any, e) {
    e.stopPropagation();
    if (this.dataFilterPreferences.singleSelection) {
      this.onDeselectAllItems();
    }

    if (!_.find(this.selectedItems, ['id', item.id])) {
      this.selectedItems =
        this.dataGroupPreferences &&
        this.dataGroupPreferences.maximumItemPerGroup &&
        this.dataGroupPreferences.maximumNumberOfGroups
          ? _.slice(
              [...this.selectedItems, item],
              0,
              this.dataGroupPreferences.maximumItemPerGroup *
                this.dataGroupPreferences.maximumNumberOfGroups
            )
          : [...this.selectedItems, item];
    }
  }

  // Remove selected Item
  onRemoveDataItem(dataItem: any, e?) {
    if (e) {
      e.stopPropagation();
    }
    const itemIndex = this.selectedItems.indexOf(dataItem);

    if (itemIndex !== -1) {
      this.selectedItems = [
        ...this.selectedItems.slice(0, itemIndex),
        ...this.selectedItems.slice(itemIndex + 1)
      ];
    }
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
        const newSelectedItems = _.uniqBy(
          [...this.selectedItems, ...dataFilterItems],
          'id'
        );
        this.selectedItems =
          this.dataGroupPreferences &&
          this.dataGroupPreferences.maximumItemPerGroup &&
          this.dataGroupPreferences.maximumNumberOfGroups
            ? _.slice(
                newSelectedItems,
                0,
                this.dataGroupPreferences.maximumItemPerGroup *
                  this.dataGroupPreferences.maximumNumberOfGroups
              )
            : newSelectedItems;
      });
  }

  // selecting all items
  onDeselectAllItems(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.selectedItems = [];
  }

  emit() {
    return {
      items: this.selectedItems,
      groups: _.map(this.selectedGroups, (dataGroup: any) =>
        _.omit(dataGroup, ['current'])
      ),
      dimension: 'dx'
    };
  }

  close(e) {
    e.stopPropagation();
    this.dataFilterClose.emit(this.emit());
  }

  onDataFilterUpdate(e) {
    e.stopPropagation();
    this.dataFilterUpdate.emit(this.emit());
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

    this.currentPageForAvailableDataItems = 1;
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

  onSelectedGroupIdUpdate(selectedGroupId: string) {
    this.selectedGroupId = selectedGroupId;
  }

  ngOnDestroy() {
    this.dataFilterClose.emit(this.emit());
  }
}
