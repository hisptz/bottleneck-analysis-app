import { Component, OnInit } from '@angular/core';
import {DashboardService} from "../../providers/dashboard.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, Subject} from "rxjs";
import {Http} from "@angular/http";
import {Constants} from "../../../shared/constants";

@Component({
  selector: 'app-dashboard-share',
  templateUrl: './dashboard-share.component.html',
  styleUrls: ['./dashboard-share.component.css']
})
export class DashboardShareComponent implements OnInit {

  loadingSharing: boolean = true;
  hasError: boolean = false;
  sharingData: any;
  errorMessage: any;
  searchTerm$ = new Subject<string>();
  userGroups: Array<any> = [];
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private http: Http,
    private constant: Constants
  ) { }

  ngOnInit() {
    this.dashboardService.loadDashboardSharingData(this.route.snapshot.params['id'])
      .subscribe(sharingData => {
        this.loadingSharing = false;
        this.sharingData = sharingData
        console.log(sharingData)
      }, error => {
        this.loadingSharing = false;
        this.hasError = true;
        this.errorMessage = error;
      })

    this.searchUserGroup().subscribe(result => {
      this.userGroups = result.userGroups;
    })
  }

  togglePublicAccess(currentAccess) {
    let availableAccesses = ['--------','r-------','rw------'];

    let newAccessIndex = availableAccesses.indexOf(currentAccess) == 2 ? 0 : availableAccesses.indexOf(currentAccess) + 1;
    this.sharingData.object.publicAccess = availableAccesses[newAccessIndex];
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
    return this.searchTerm$.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    return this.http
      .get(this.constant.api + 'sharing/search?key='+ term + '&pageSize=20')
      .map(res => res.json());
  }

}
