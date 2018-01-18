import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {INITIAL_SHARING_ENTITY, SharingEntity, SharingItem} from './models/sharing-entity';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SharingService} from './services/sharing.service';
import {debounceTime} from 'rxjs/operators';
import 'rxjs/add/observable/from';

@Component({
  selector: 'app-sharing-filter',
  templateUrl: './sharing-filter.component.html',
  styleUrls: ['./sharing-filter.component.css']
})
export class SharingFilterComponent implements OnInit {

  @Input() sharingEntity: SharingEntity;
  private _sharingList$: BehaviorSubject<SharingItem[]> = new BehaviorSubject<SharingItem[]>([]);
  sharingList$: Observable<SharingItem[]>;
  searchTerm: string;
  showGroupList: boolean;
  constructor(private sharingService: SharingService) {
    this.sharingEntity = INITIAL_SHARING_ENTITY;
    this.sharingList$ = this._sharingList$.asObservable();
  }

  ngOnInit() {
    this._sharingList$.next(this.mapEntityToSharingList(this.sharingEntity));
    this.focusInput();
  }

  mapEntityToSharingList(sharingEntity) {
    return _.map(_.keys(sharingEntity), (key) => sharingEntity[key]);
  }

  focusInput() {
    document.getElementById('sharing_filter_input').focus();
  }

  searchUserGroup(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value;
    if (this.searchTerm.trim() !== '') {
      Observable.from(this.searchTerm).debounceTime(400)
        .distinctUntilChanged()
        .switchMap((term: string) => this.sharingService.searchUserGroups(term))
        .subscribe((userGroupResult: any) => {
          console.log(userGroupResult);
          this.showGroupList = false;
        });
    } else {
      this.showGroupList = false;
    }
  }

}
