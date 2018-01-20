import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import {
  INITIAL_SHARING_ENTITY,
  SharingEntity,
  SharingItem
} from './models/sharing-entity';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SharingService } from './services/sharing.service';
import { debounceTime } from 'rxjs/operators';
import 'rxjs/add/observable/from';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import * as sharingConstants from './sharing-constants';

@Component({
  selector: 'app-sharing-filter',
  templateUrl: './sharing-filter.component.html',
  styleUrls: ['./sharing-filter.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class SharingFilterComponent implements OnInit {
  @Input() sharingEntity: SharingEntity;
  @Output()
  onSharingEntityUpdate: EventEmitter<SharingEntity> = new EventEmitter<
    SharingEntity
  >();
  private _sharingList$: BehaviorSubject<SharingItem[]> = new BehaviorSubject<
    SharingItem[]
  >([]);
  sharingList$: Observable<SharingItem[]>;
  searchTerm: string;
  loadingSearchList: boolean;
  searchList: any[];
  constructor(private sharingService: SharingService) {
    this.sharingEntity = INITIAL_SHARING_ENTITY;
    this.sharingList$ = this._sharingList$.asObservable();
    this.searchList = [];
    this.loadingSearchList = true;
  }

  ngOnInit() {
    this._sharingList$.next(this.mapEntityToSharingList(this.sharingEntity));
    this.focusInput();
    this.sharingService.getSearchList().subscribe((searchList: any[]) => {
      this.searchList = this._updateSearchList(searchList, this.sharingEntity);
      this.loadingSearchList = false;
    });
  }

  mapEntityToSharingList(sharingEntity) {
    return _.map(_.keys(sharingEntity), key => sharingEntity[key]);
  }

  focusInput() {
    document.getElementById('sharing_filter_input').focus();
  }

  addSharingItem(e, sharingItem: any) {
    e.stopPropagation();

    this.sharingEntity = {
      ...this.sharingEntity,
      [sharingItem.id]: {
        id: sharingItem.id,
        name: sharingItem.displayName || sharingItem.name,
        type: sharingItem.type,
        access: 'r-------'
      }
    };

    this._sharingList$.next(this.mapEntityToSharingList(this.sharingEntity));

    this.searchList = this._updateSearchList(
      this.searchList,
      this.sharingEntity
    );

    this.onSharingEntityUpdate.emit(this.sharingEntity);
  }

  changeAccess(e, sharingItem: SharingItem) {
    e.stopPropagation();

    this.sharingEntity = {
      ...this.sharingEntity,
      [sharingItem.id]: {
        ...sharingItem,
        access: sharingItem.isExternal
          ? !sharingItem.access
          : sharingConstants.ACCESS_LIST[
              this._getNewAccessIndex(sharingItem.access)
            ]
      }
    };

    this._sharingList$.next(this.mapEntityToSharingList(this.sharingEntity));

    this.searchList = this._updateSearchList(
      this.searchList,
      this.sharingEntity
    );

    this.onSharingEntityUpdate.emit(this.sharingEntity);
  }

  removeSharingItem(e, sharingItem: SharingItem) {
    e.stopPropagation();
    this.sharingEntity = {
      ..._.omit(this.sharingEntity, [sharingItem.id])
    };

    this._sharingList$.next(this.mapEntityToSharingList(this.sharingEntity));

    this.searchList = this._updateSearchList(
      this.searchList,
      this.sharingEntity
    );

    this.onSharingEntityUpdate.emit(this.sharingEntity);
  }

  private _getNewAccessIndex(currentAccess): number {
    return sharingConstants.ACCESS_LIST.indexOf(currentAccess) === 2
      ? 0
      : sharingConstants.ACCESS_LIST.indexOf(currentAccess) + 1;
  }

  private _updateSearchList(searchList, sharingEntity) {
    return _.map(searchList, (searchItem: any) => {
      const availabelEntity = sharingEntity[searchItem.id];
      return {
        ...searchItem,
        available: availabelEntity ? true : false,
        access: availabelEntity ? availabelEntity.access : ''
      };
    });
  }
}
