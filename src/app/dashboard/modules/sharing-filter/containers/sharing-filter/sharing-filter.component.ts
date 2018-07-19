import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SharingFilterState } from '../../store/reducers/sharing-filter.reducer';
import { LoadSharingFilterItemAction } from '../../store/actions/sharing-filter.actions';
import { Observable } from 'rxjs';
import { SharingItem, SharingFilterVm } from '../../models';
import { getSharingFilterItemById } from '../../store/selectors/sharing-filter.selectors';
import { LoadSharingSearchListAction } from '../../store/actions/sharing-search-list.actions';
import { SharingSearchListState } from '../../store/reducers/sharing-search-list.reducer';
import {
  getSharingSearchLoading,
  getSharingSearchListVm
} from '../../store/selectors/sharing-search-list.selectors';
import { WIEW_ICON, EDIT_ICON, TICK_ICON, CLOSE_ICON } from '../../icons';
import { take } from 'rxjs/operators';
import { SharingItemState } from '../../store/reducers/sharing-item.reducer';
import {
  UpsertSharingItemAction,
  RemoveSharingItemAction
} from '../../store/actions/sharing-item.actions';
import { SharingSearchListVM } from '../../models/sharing-search-list-vm.model';

@Component({
  selector: 'app-sharing-filter',
  templateUrl: './sharing-filter.component.html',
  styleUrls: ['./sharing-filter.component.scss']
})
export class SharingFilterComponent implements OnInit, OnChanges {
  /**
   * sharing type eg. dashboard, favorite like chart, map etc
   */
  @Input() type: string;

  /**
   * Sharing item identifier
   */
  @Input() id: string;

  searchTerm: string;

  sharingFilter$: Observable<SharingFilterVm>;
  sharingSearchList$: Observable<SharingSearchListVM[]>;
  loadingSharingSearch$: Observable<boolean>;

  // icons
  viewIcon: string;
  editIcon: string;
  tickIcon: string;
  closeIcon: string;

  constructor(
    private sharingFilterStore: Store<SharingFilterState>,
    private sharingItemStore: Store<SharingItemState>,
    private sharingSearchStore: Store<SharingSearchListState>
  ) {
    sharingFilterStore.dispatch(new LoadSharingSearchListAction());
    this.loadingSharingSearch$ = sharingFilterStore.select(
      getSharingSearchLoading
    );

    // icons
    this.viewIcon = WIEW_ICON;
    this.editIcon = EDIT_ICON;
    this.tickIcon = TICK_ICON;
    this.closeIcon = CLOSE_ICON;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['id']) {
      if (this.id && this.type) {
        this.sharingFilter$ = this.sharingFilterStore.select(
          getSharingFilterItemById(this.id)
        );
        this.sharingSearchList$ = this.sharingSearchStore.select(
          getSharingSearchListVm(this.id)
        );
        this.sharingFilterStore.dispatch(
          new LoadSharingFilterItemAction(this.id, this.type)
        );
      }
    }
  }

  ngOnInit() {}

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
      .pipe(take(1))
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
          access: sharingItem.isExternal ? !sharingItem.access : newAccess
        };
        this.sharingItemStore.dispatch(
          new UpsertSharingItemAction(
            newSharingItem,
            sharingFilter.id,
            this.type
          )
        );
      });
  }

  removeSharingItem(e, sharingItem: SharingItem) {
    e.stopPropagation();
    this.sharingItemStore.dispatch(
      new RemoveSharingItemAction(sharingItem.id, this.id, this.type)
    );
  }
}
