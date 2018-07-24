import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ARROW_DOWN_ICON, TICK_ICON, PLUS_ICON } from '../../icons';
import { Store } from '@ngrx/store';
import {
  FavoriteFilterState,
  getFavoriteFilters
} from '../../store/reducers/favorite-filter.reducer';
import { LoadFavoriteFiltersAction } from '../../store/actions/favorite-filter.actions';
import { Observable } from 'rxjs';
import { FavoriteFilter } from '../../models/favorite-filter.model';
import { DashboardAccess } from '../../../../models';
import { DASHBOARD_TYPES } from '../../constants/dashboard-types.constant';

@Component({
  selector: 'app-favorite-filter',
  templateUrl: './favorite-filter.component.html',
  styleUrls: ['./favorite-filter.component.scss']
})
export class FavoriteFilterComponent implements OnInit {
  @Input() currentUser: any;
  @Input() dashboardAccess: DashboardAccess;
  searchPlaceholder: string;
  newFavoritePlaceholder: string;
  showSearchFilters: boolean;
  searchFilterOptions: any[];
  currentSearchFilterOptionId: string;

  searchTerm: string;
  showBody: boolean;

  // icons
  arrowDownIcon: string;
  tickIcon: string;
  plusIcon: string;

  favoriteFilters$: Observable<FavoriteFilter[]>;

  @Output()
  addFavorite: EventEmitter<{
    id: string;
    name: string;
    dashboardTypeDetails: any;
  }> = new EventEmitter<{
    id: string;
    name: string;
    dashboardTypeDetails: any;
  }>();

  constructor(private store: Store<FavoriteFilterState>) {
    this.favoriteFilters$ = store.select(getFavoriteFilters);
    this.searchPlaceholder =
      'Search for charts, tables, maps, apps, reports, resources etc';
    this.newFavoritePlaceholder = 'Create new favorite';
    this.searchFilterOptions = [
      {
        name: 'Show All',
        id: 'all'
      },
      {
        name: 'Created by me',
        id: 'me'
      },
      {
        name: 'Created by others',
        id: 'others'
      }
    ];
    this.currentSearchFilterOptionId = 'all';

    this.arrowDownIcon = ARROW_DOWN_ICON;
    this.tickIcon = TICK_ICON;
    this.plusIcon = PLUS_ICON;
  }

  ngOnInit() {}

  onUpdateSearchBody(e) {
    e.stopPropagation();
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.showBody = true;
    }
  }

  onToggleSearchFilters(e) {
    e.stopPropagation();
    this.showSearchFilters = !this.showSearchFilters;
  }
  onSetCurrentFilterOption(selectedSearchFilterOptionId, e) {
    e.stopPropagation();
    this.currentSearchFilterOptionId = selectedSearchFilterOptionId;
    this.showSearchFilters = false;
  }

  onSearch(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value;
    if (this.searchTerm.trim() !== '') {
      this.showBody = true;
      this.store.dispatch(new LoadFavoriteFiltersAction(this.searchTerm));
    } else {
      this.showBody = false;
    }
  }

  onAddFavorite(favoriteFilter, e) {
    e.stopPropagation();
    const dashboardTypeDetails = DASHBOARD_TYPES[favoriteFilter.type];
    this.addFavorite.emit({
      id: favoriteFilter.id,
      name: favoriteFilter.name,
      dashboardTypeDetails
    });
  }
}
