import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { CLOSE_ICON, EDIT_ICON, TICK_ICON, WIEW_ICON } from '../../icons';
import { SharingFilterVm, SharingItem, SharingSearchList } from '../../models';
import { LoadSharingFilterItemAction } from '../../store/actions/sharing-filter.actions';
import {
  RemoveSharingItemAction,
  UpsertSharingItemAction,
} from '../../store/actions/sharing-item.actions';
import { LoadSharingSearchListAction } from '../../store/actions/sharing-search-list.actions';
import { SharingFilterState } from '../../store/reducers/sharing-filter.reducer';
import { SharingItemState } from '../../store/reducers/sharing-item.reducer';
import {
  getSharingSearchList,
  SharingSearchListState,
} from '../../store/reducers/sharing-search-list.reducer';
import { getSharingFilterItemById } from '../../store/selectors/sharing-filter.selectors';
import {
  getSharingSearchLoaded,
  getSharingSearchLoading,
} from '../../store/selectors/sharing-search-list.selectors';

@Component({
  selector: 'app-sharing-filter',
  templateUrl: './sharing-filter.component.html',
  styleUrls: ['./sharing-filter.component.scss'],
})
export class SharingFilterComponent implements OnInit {
  searchTerm: string;

  sharingFilter$: Observable<SharingFilterVm>;
  sharingSearchList$: Observable<SharingSearchList[]>;
  loadingSharingSearch$: Observable<boolean>;
  loadedSharingSearch$: Observable<boolean>;

  sharingAccesses: any[];

  // icons
  viewIcon: string;
  editIcon: string;
  tickIcon: string;
  closeIcon: string;

  @Output() addSharingItem: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private sharingFilterStore: Store<SharingFilterState>,
    private sharingItemStore: Store<SharingItemState>,
    private sharingSearchStore: Store<SharingSearchListState>
  ) {
    this.sharingFilterStore.dispatch(new LoadSharingSearchListAction());

    // icons
    this.viewIcon = WIEW_ICON;
    this.editIcon = EDIT_ICON;
    this.tickIcon = TICK_ICON;
    this.closeIcon = CLOSE_ICON;

    this.sharingAccesses = [
      {
        name: 'Can view and edit',
        access: 'rw------',
      },
      {
        name: 'Can View Only',
        access: 'r-------',
      },
    ];
  }

  ngOnInit() {
    this.sharingSearchList$ = this.sharingSearchStore.select(
      getSharingSearchList
    );

    this.loadingSharingSearch$ = this.sharingSearchStore.select(
      getSharingSearchLoading
    );

    this.loadedSharingSearch$ = this.sharingSearchStore.select(
      getSharingSearchLoaded
    );
  }

  changeAccess(e, sharingItem: SharingItem, access?: string) {
    e.stopPropagation();
    const newAccess = access
      ? sharingItem.access === access
        ? access === 'rw------'
          ? 'r-------'
          : access === 'r-------'
          ? '--------'
          : '--------'
        : access === 'r-------'
        ? sharingItem.access === '' || sharingItem.access === '--------'
          ? access
          : '--------'
        : access
      : sharingItem.access;

    this.sharingFilter$
      .pipe(first((sharingFilter: SharingFilterVm) => sharingFilter !== null))
      .subscribe((sharingFilter: SharingFilterVm) => {
        const sharingItemId = sharingItem.id.split('_')[0];
        const newSharingItem: SharingItem = {
          ...sharingItem,
          id: `${sharingItemId}_${sharingFilter.id}`,
          sharingFilterId: sharingFilter.id,
          name: sharingItem.isPublic
            ? newAccess === '--------'
              ? 'Only me'
              : 'Everyone'
            : sharingItem.name,
          access: sharingItem.isExternal ? !sharingItem.access : newAccess,
        };
        this.sharingItemStore.dispatch(
          new UpsertSharingItemAction(newSharingItem, sharingFilter.id, '')
        );
      });
  }

  onSearchSharing(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value;
  }

  onAddSharingItem(e, sharingItem: any) {
    e.stopPropagation();
    this.searchTerm = undefined;
    this.addSharingItem.emit(sharingItem);
  }
}
