import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DataGroup } from 'src/app/models';
import * as fromHelpers from '../../helpers';
import { removeAllMembersFromGroups } from '../../helpers';
import { addMembersToGroups } from '../../helpers/add-members-to-group.helper';
import { getDataGroupBasedOnDataItem } from '../../helpers/get-data-group-based-on-data-item.helper';
import { removeMemberFromGroup } from '../../helpers/remove-member-from-group.helper';
import { updateDataGroupInList } from '../../helpers/update-data-group-in-list.helper';
import { ARROW_LEFT_ICON, ARROW_RIGHT_ICON, LIST_ICON } from '../../icons';
import { DataFilterPreference } from '../../model/data-filter-preference.model';
import * as fromModels from '../../models';
import * as fromDataFilterActions from '../../store/actions/data-filter.actions';
import * as fromDataFilterReducer from '../../store/reducers/data-filter.reducer';
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
  dataFilterPreferences: DataFilterPreference;

  @Input()
  dataGroupPreferences: {
    maximumNumberOfGroups: number;
    maximumItemPerGroup: number;
    ignoreMaximumRestrictions: boolean;
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
  icons: { [name: string]: string };

  dataFilterGroups$: Observable<any[]>;
  currentDataFilterGroup$: Observable<any>;
  dataFilterItems$: Observable<any[]>;
  dataFilterLoading$: Observable<boolean>;

  constructor(private dataFilterStore: Store<fromDataFilterReducer.State>) {
    // Set default data filter preferences
    this.dataFilterPreferences = {
      enabledSelections: ['in', 'fn'],
      singleSelection: false,
      showGroupsOnStartup: true,
      hideSelectedPanel: true
    };

    // Set default data group preferences
    this.dataGroupPreferences = {
      maximumNumberOfGroups: 6,
      maximumItemPerGroup: 3,
      ignoreMaximumRestrictions: false
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

    this.icons = { LIST_ICON, ARROW_LEFT_ICON, ARROW_RIGHT_ICON };

    this.showGroupingPanel = false;
  }

  ngOnInit() {
    // set data filter selections
    this.dataFilterSelections = fromHelpers.getDataFilterSelectionsBasedOnPreferences(
      this.dataFilterPreferences
    );

    // Set show group status based on preferences
    this.showGroupingPanel =
      this.dataFilterPreferences &&
      this.dataFilterPreferences.showGroupsOnStartup;
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

      // Also add members into groups
      this.selectedGroups = addMembersToGroups(
        this.selectedGroups,
        this.selectedGroupId,
        this.selectedItems,
        this.dataGroupPreferences
      );
    }
  }

  // Remove selected Item
  onRemoveDataItem(dataItemDetails: { dataItem: any; group?: DataGroup }, e?) {
    if (e) {
      e.stopPropagation();
    }

    const removedItem = _.find(this.selectedItems, [
      'id',
      dataItemDetails && dataItemDetails.dataItem
        ? dataItemDetails.dataItem.id
        : undefined
    ]);

    const itemIndex = this.selectedItems.indexOf(removedItem);

    if (itemIndex !== -1) {
      this.selectedItems = [
        ...this.selectedItems.slice(0, itemIndex),
        ...this.selectedItems.slice(itemIndex + 1)
      ];

      const dataGroup =
        dataItemDetails.group ||
        getDataGroupBasedOnDataItem(this.selectedGroups, removedItem);

      if (dataGroup) {
        // Also remove item from the group
        this.selectedGroups = updateDataGroupInList(
          this.selectedGroups,
          removeMemberFromGroup(dataGroup, removedItem)
        );
      }
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

        this.selectedGroups = addMembersToGroups(
          this.selectedGroups,
          this.selectedGroupId,
          this.selectedItems,
          this.dataGroupPreferences
        );
      });
  }

  // selecting all items
  onDeselectAllItems(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.selectedItems = [];

    this.selectedGroups = removeAllMembersFromGroups(this.selectedGroups);
  }

  emit() {
    return {
      items: this.selectedItems,
      groups: _.filter(
        _.map(this.selectedGroups, (dataGroup: any) => {
          return _.omit(dataGroup, ['current']);
        }),
        (dataGroup: DataGroup) => dataGroup.name !== ''
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
    this.selectedGroups = [...dataGroups];
  }

  onSelectedGroupIdUpdate(selectedGroupId: string) {
    this.selectedGroupId = selectedGroupId;
  }

  onUpdateSelectedItems(selectedItems: any[]) {
    this.selectedItems = [...selectedItems];
  }

  ngOnDestroy() {
    this.dataFilterClose.emit(this.emit());
  }
}
