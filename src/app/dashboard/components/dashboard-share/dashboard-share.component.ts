import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DashboardService} from "../../providers/dashboard.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {Http} from "@angular/http";
import {Constants} from "../../../shared/constants";
import {isUndefined} from "util";

const availableAccesses = ['--------','r-------','rw------'];
@Component({
  selector: 'app-dashboard-share',
  templateUrl: './dashboard-share.component.html',
  styleUrls: ['./dashboard-share.component.css']
})
export class DashboardShareComponent implements OnInit {

  loadingSharing: boolean = true;
  updated: boolean = false;
  updating: boolean = false;
  hasError: boolean = false;
  showUserGroupList: boolean = false;
  sharingData: any;
  errorMessage: any;
  searchTerm$ = new Subject<string>();
  userGroups: Array<any> = [];
  searching: boolean = false;
  @Output() onCloseSharing: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private http: Http,
    private constant: Constants
  ) { }

  ngOnInit() {
    this.loadSharingData();
    this.route.params.forEach(params => {
      this.loadingSharing = true;
      this.updated = false;
      this.loadSharingData(params['id'])
    });


    this.searchUserGroup().subscribe(result => {
      this.searching = false;
      this.searchTerm$.subscribe(term => {
        if(term.length > 0) {
          this.userGroups = [];
          //Push only those unavailable in the list
          if(result.hasOwnProperty('userGroups')) {
            result.userGroups.forEach(userGroup => {
              userGroup.access = '--------';
              if(!this.checkIfUserGroupExist(userGroup.id)) {
                this.userGroups.push(userGroup);
              }
            });
            this.showUserGroupList = true;
          } else {
            this.showUserGroupList = false;
          }
        } else {
          this.showUserGroupList = false;
        }
      });
    });
  }

  checkIfUserGroupExist(userGroupId) {
    let exist = false;
    if(this.sharingData.object.hasOwnProperty('userGroupAccesses')) {
      if(this.sharingData.object.userGroupAccesses.length > 0) {
        for(let group of this.sharingData.object.userGroupAccesses) {
          if(group.id == userGroupId) {
            exist = true;
            break;
          }
        }
      }
    }
    return exist;
  }

  loadSharingData(dashboardId?) {
    this.dashboardService.loadDashboardSharingData(dashboardId ? dashboardId : this.route.snapshot.params['id'])
      .subscribe(sharingData => {
        this.loadingSharing = false;
        this.sharingData = sharingData;
      }, error => {
        this.loadingSharing = false;
        this.hasError = true;
        this.errorMessage = error;
      })
  }

  togglePublicAccess(currentAccess) {
    let newAccessIndex = this.getNewAccessIndex(currentAccess);
    this.sharingData.object.publicAccess = availableAccesses[newAccessIndex];
  }

  toggleUserGroupAccess(access, groupId) {
    let newAccessIndex = this.getNewAccessIndex(access);
    if(newAccessIndex == 0) {
      this.removeUserGroup(groupId)
    } else {
      this.sharingData.object.userGroupAccesses.forEach(group => {
        if(group.id == groupId) {
          group.access = availableAccesses[newAccessIndex];
        }
      })
    }
  }

  getNewAccessIndex(currentAccess): number {
    return availableAccesses.indexOf(currentAccess) == 2 ? 0 : availableAccesses.indexOf(currentAccess) + 1;
  }

  readableAccess(access) {
    let accessName:string = 'Unknown Access';
    if(access == 'r-------') {
      accessName = 'Can view';
    } else if(access == 'rw------') {
      accessName = 'Can view and edit';
    } else if(access == '--------') {
      accessName = 'No Access'
    }
    return accessName;
  }

  searchUserGroup() {
    this.searchTerm$.subscribe(terms => {
      if(terms.length > 0) {
        this.searching = true;
      }
    })
    return this.searchTerm$.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    return this.http
      .get(this.constant.api + 'sharing/search?key='+ term + '&pageSize=20')
      .map(res => res.json());
  }

  removeUserGroup(groupId) {
    this.sharingData.object.userGroupAccesses.forEach((group, index) => {
      if(group.id == groupId) {
        this.sharingData.object.userGroupAccesses.splice(this.sharingData.object.userGroupAccesses.indexOf(group),1);
      }
    })
  }

  addUserGroup(group) {
    this.showUserGroupList = false;
    if(!this.sharingData.object.hasOwnProperty('userGroupAccesses')) {
      this.sharingData.object.userGroupAccesses = [];
    }
    this.sharingData.object.userGroupAccesses.push(group);
  }

  updateSharing() {
    this.updating = true;
    this.dashboardService.saveSharingData(this.sharingData, this.route.snapshot.params['id'])
      .subscribe(response => {
        this.updating = false;
        this.updated = true;
      }, error => {
        console.log('There was an error updating sharing settings')
      })
  }

  closeSharingBody() {
    this.onCloseSharing.emit(true);
  }

}
