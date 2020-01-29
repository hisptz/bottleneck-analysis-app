import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Determinant } from 'src/app/models';
import * as fromHelpers from '../../helpers';
import { removeAllMembersFromDeterminants } from '../../helpers';
import { addMembersToDeterminants } from '../../helpers/add-members-to-group.helper';
import { getDataGroupBasedOnDataItem } from '../../helpers/get-data-group-based-on-data-item.helper';
import { removeMemberFromGroup } from '../../helpers/remove-member-from-group.helper';
import { updateDeterminantInList } from '../../helpers/update-data-determinant-in-list.helper';
import { ARROW_LEFT_ICON, ARROW_RIGHT_ICON, LIST_ICON } from '../../icons';
import { DataFilterPreference } from '../../model/data-filter-preference.model';
import * as fromDataFilterActions from '../../store/actions/data-filter.actions';
import * as fromDataFilterReducer from '../../store/reducers/data-filter.reducer';
import * as fromDataFilterSelectors from '../../store/selectors/data-filter.selectors';
import { DataFilterType } from '../../models/data-filter-type.model';
import { Fn } from '@iapps/function-analytics';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.css'],
})
export class DataFilterComponent implements OnInit {
  @Input() selectedItems: any[] = [];
  @Input() selectedGroups: any[] = [];
  @Input() determinants: Determinant[] = [];
  @Input() userAccesses: any[] = [];
  @Input() userGroupAccesses: any[] = [];
  @Input() publicAccess: string;
  @Input() dataFilterPreferences: DataFilterPreference;
  @Input() generalDataConfiguration: any;
  @Input() bottleneckPeriodType = 'Yearly';
  @Input() interventionName;
  @Input() determinantPreferences: {
    maximumNumberOfDeterminants: number;
    maximumItemPerDeterminant: number;
    ignoreMaximumRestrictions: boolean;
  };

  @Output() dataFilterUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataFilterClose: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateSharingDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateInterventionDetails: EventEmitter<any> = new EventEmitter<
    any
  >();

  showGroupingPanel: boolean;
  selectedItems$: Observable<any>;
  querystring: string;
  dataItemSearchTerm: string;
  showBody = false;
  currentPageForAvailableDataItems = 1;
  currentPageForSelectedDataItems = 1;

  selectedDeterminantId: string;

  dataFilterTypes: DataFilterType[];
  showGroups: boolean;

  // icons
  icons: { [name: string]: string };

  dataFilterGroups$: Observable<any[]>;
  currentDataFilterGroup$: Observable<any>;
  dataFilterItems$: Observable<any[]>;
  dataFilterLoading$: Observable<boolean>;
  periodTypes: any[];

  constructor(private dataFilterStore: Store<fromDataFilterReducer.State>) {
    // Set default data filter preferences
    this.dataFilterPreferences = {
      enabledSelections: ['in', 'fn'],
      singleSelection: false,
      showGroupsOnStartup: true,
      hideSelectedPanel: true,
    };

    // Set default data group preferences
    this.determinantPreferences = {
      maximumNumberOfDeterminants: 6,
      maximumItemPerDeterminant: 3,
      ignoreMaximumRestrictions: false,
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

    const periodTypeInstance = new Fn.PeriodType();

    this.periodTypes = periodTypeInstance.get();
  }

  ngOnInit() {
    // set data filter selections
    this.dataFilterTypes = fromHelpers.getDataFilterSelectionsBasedOnPreferences(
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

  onSetDataFilterGroup(dataFilterGroup: any) {
    this.dataFilterStore.dispatch(
      new fromDataFilterActions.SetCurrentDataFilterGroup(dataFilterGroup.id)
    );
  }

  // this will add a selected item in a list function
  onSelectDataItem(item: any) {
    if (this.dataFilterPreferences.singleSelection) {
      this.onDeselectAllItems();
    }

    if (!_.find(this.selectedItems, ['id', item.id])) {
      this.selectedItems =
        this.determinantPreferences &&
        this.determinantPreferences.maximumItemPerDeterminant &&
        this.determinantPreferences.maximumNumberOfDeterminants
          ? _.slice(
              [...this.selectedItems, item],
              0,
              this.determinantPreferences.maximumItemPerDeterminant *
                this.determinantPreferences.maximumNumberOfDeterminants
            )
          : [...this.selectedItems, item];

      // Also add members into groups
      this.determinants = this.determinants.map((determinant: Determinant) => {
        return determinant.id === this.selectedDeterminantId
          ? {
              ...determinant,
              members: [...(determinant.members || []), item],
            }
          : determinant;
      });

      this.selectedDeterminantId = '';
    }
  }

  onUpdateDataItem(dataItem: any) {
    const dataItemIndex = this.selectedItems.indexOf(
      _.find(this.selectedItems, ['id', dataItem ? dataItem.id : ''])
    );

    if (dataItemIndex !== -1) {
      this.selectedItems = [
        ..._.slice(this.selectedItems, 0, dataItemIndex),
        dataItem,
        ..._.slice(this.selectedItems, dataItemIndex + 1),
      ];
    }
  }

  // Remove selected Item
  onRemoveDataItem(dataItemDetails: {
    dataItem: any;
    determinant?: Determinant;
  }) {
    const removedItem = _.find(this.selectedItems, [
      'id',
      dataItemDetails && dataItemDetails.dataItem
        ? dataItemDetails.dataItem.id
        : undefined,
    ]);

    const itemIndex = this.selectedItems.indexOf(removedItem);

    if (itemIndex !== -1) {
      this.selectedItems = [
        ...this.selectedItems.slice(0, itemIndex),
        ...this.selectedItems.slice(itemIndex + 1),
      ];

      const determinant =
        dataItemDetails.determinant ||
        getDataGroupBasedOnDataItem(this.determinants, removedItem);

      if (determinant) {
        // Also remove item from the group
        this.determinants = updateDeterminantInList(
          this.determinants,
          removeMemberFromGroup(determinant, removedItem)
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
          this.determinantPreferences &&
          this.determinantPreferences.maximumItemPerDeterminant &&
          this.determinantPreferences.maximumNumberOfDeterminants
            ? _.slice(
                newSelectedItems,
                0,
                this.determinantPreferences.maximumItemPerDeterminant *
                  this.determinantPreferences.maximumNumberOfDeterminants
              )
            : newSelectedItems;

        this.determinants = addMembersToDeterminants(
          this.determinants,
          this.selectedDeterminantId,
          this.selectedItems,
          this.determinantPreferences
        );
      });
  }

  // selecting all items
  onDeselectAllItems() {
    this.selectedItems = [];

    this.determinants = removeAllMembersFromDeterminants(this.determinants);
  }

  emit() {
    return {
      items: this.selectedItems,
      groups: _.filter(
        _.map(this.determinants, (determinant: any) => {
          return _.omit(determinant, ['current']);
        }),
        (determinant: Determinant) => determinant.name !== ''
      ),
      dimension: 'dx',
      useShortNameAsLabel: this.generalDataConfiguration.useShortNameAsLabel,
      legendDefinitions: this.generalDataConfiguration.legendDefinitions,
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

  onToggleDataFilterType(dataFilterTypes: DataFilterType[]) {
    this.dataFilterStore.dispatch(
      new fromDataFilterActions.UpdateActiveDataFilterSelections(
        dataFilterTypes
      )
    );

    this.currentPageForAvailableDataItems = 1;
    this.dataItemSearchTerm = '';
  }

  onToggleDataFilterSelection(toggledDataFilterSelection, event) {
    event.stopPropagation();
    const multipleSelection = event.ctrlKey ? true : false;
    this.dataFilterTypes = _.map(
      this.dataFilterTypes,
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
              : false,
        };
      }
    );
  }

  toggleDataFilterGroupList(e) {
    e.stopPropagation();
    this.showGroups = !this.showGroups;
  }

  onToggleGroupingPanel(e) {
    e.stopPropagation();
    this.showGroupingPanel = !this.showGroupingPanel;
  }

  onDeterminantsUpdate(determinants) {
    this.determinants = [...determinants];
  }

  onSelectDeterminant(selectedDeterminantId: string) {
    this.selectedDeterminantId = selectedDeterminantId;
  }

  onUpdateSelectedItems(selectedItems: any[]) {
    this.selectedItems = [...selectedItems];
  }

  onUpdateGeneralDataConfiguration(value: any, attributeName: string) {
    this.generalDataConfiguration = {
      ...this.generalDataConfiguration,
      [attributeName]: value,
    };
  }
  onUpdateSharingItem(sharingDetails: any) {
    this.updateSharingDetails.emit(sharingDetails);
  }

  onSelectBottleneckPeriodType(bottleneckPeriodType: string) {
    this.updateInterventionDetails.emit({ bottleneckPeriodType });
  }
}
