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
  @Input() sharingType: string;
  @Input() sharingId: string;
  @Input() sharingUser: any;
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
    const sharingInput = document.getElementById('sharing_filter_input');

    if (sharingInput) {
      sharingInput.focus();
    }
  }

  changeAccess(e, sharingItem: SharingItem, access?: string) {
    e.stopPropagation();
    const newAccess = access ? sharingItem.access === access ?
      access === 'rw------' ? 'r-------' : access === 'r-------' ?
        '--------' : '--------' : access === 'r-------' ?
        sharingItem.access === '' || sharingItem.access === '--------'  ?
          access : '--------' : access : sharingItem.access;

    this.sharingEntity = {
      ...this.sharingEntity,
      [sharingItem.id]: {
        ...sharingItem,
        name: sharingItem.isPublic ?
          newAccess === '--------' ?
            'Only me' : 'Everyone' : sharingItem.name,
        access: sharingItem.isExternal
          ? !sharingItem.access
          : newAccess
      }
    };

    if (newAccess === '--------' && !sharingItem.isPublic) {
      this.sharingEntity = {
        ..._.omit(this.sharingEntity, [sharingItem.id])
      };
    }

    this._sharingList$.next(this.mapEntityToSharingList(this.sharingEntity));

    this.searchList = this._updateSearchList(
      this.searchList,
      this.sharingEntity
    );

    /**
     * Save sharing info
     */

    this.onSharingEntityUpdate.emit(this.sharingEntity);

    this.sharingService.saveSharingResults({
      id: this.sharingId,
      publicAccess: this.sharingEntity['public_access'].access,
      externalAccess: this.sharingEntity['external_access'].access,
      user: {},
      userGroupAccesses: this.mapSharingEntitiesToAccessesArray(this.sharingEntity, 'userGroup'),
      userAccesses: this.mapSharingEntitiesToAccessesArray(this.sharingEntity, 'user'),
    }, this.sharingType, this.sharingId).subscribe(() => {

    }, error => console.error(error));
  }

  mapSharingEntitiesToAccessesArray(sharingEntity: SharingEntity, accessType: string) {
    return _.filter(
      _.map(_.keys(sharingEntity), key => {
        const entity = sharingEntity[key];
        return {
          id: entity.id,
          access: entity.access,
          type: entity.type
        };
      }),
      sharingObject => sharingObject.type === accessType);
  }

  removeSharingItem(sharingItem: SharingItem, e?) {
    if (e) {
      e.stopPropagation();
    }

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

  private _updateSearchList(searchList, sharingEntity) {
    const newSearchList = _.map(searchList, (searchItem: any) => {
      const availableEntity = sharingEntity[searchItem.id];
      return {
        ...searchItem,
        available: availableEntity ? true : false,
        name: availableEntity ? availableEntity.name : searchItem.name,
        access: availableEntity ? availableEntity.access : ''
      };
    });
    return !_.find(searchList, ['id', 'public_access']) ? [
      {
        ...this.sharingEntity['public_access'],
      },
      ...newSearchList
    ] : newSearchList;
  }
}
