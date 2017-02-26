import {Component, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {DashboardService} from "../../providers/dashboard.service";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CurrentUserService} from "../../../shared/providers/current-user.service";
import {isUndefined} from "util";
import {isNull} from "util";

@Component({
  selector: 'app-dashboard-landing',
  templateUrl: './dashboard-landing.component.html',
  styleUrls: ['./dashboard-landing.component.css']
})
export class DashboardLandingComponent implements OnInit,AfterViewInit {

  hasError: boolean;
  loading: boolean;
  showForm: boolean;
  submitted: boolean;
  public createDashboardForm: FormGroup;
  constructor(
      private dashboardService: DashboardService,
      private router: Router,
      private formGroup: FormBuilder,
      private currentUserService: CurrentUserService
  ) {
    this.hasError = false;
    this.loading = true;
    this.showForm = false;
    this.submitted = false;
  }

  ngOnInit() {
    this.dashboardService.all().subscribe(dashboards => {
      if(dashboards.length == 0) {
        this.loading = false;
      } else {
        //find last dashboard id for the user
        this.currentUserService.getCurrentUser().subscribe(currentUser => {
          let dashboardId = localStorage.getItem('dhis2.dashboard.current.' + currentUser.userCredentials.username);
          if(isUndefined(dashboardId) || dashboardId == 'null') {
            localStorage.setItem('dhis2.dashboard.current.' + currentUser.userCredentials.username,dashboards[0].id);
            this.router.navigate(['dashboards/'+ dashboards[0].id + '/dashboard']);
          } else {
            this.router.navigate(['dashboards/'+ dashboardId + '/dashboard']);
          }
        })
      }
    }, error => {
      this.hasError = true;
      this.loading = false;
    })

    this.createDashboardForm = this.formGroup.group({
      name: ['',[Validators.required,Validators.minLength(3)]]
    })
  }

  ngAfterViewInit() {
  }

  save(dashboardData) {
    this.submitted = true;
    this.dashboardService.create(dashboardData)
      .subscribe(
        dashboardId => {
          this.router.navigate(['dashboards/'+ dashboardId + '/dashboard']);
        },
        error => {
          console.log(error)
        })
  }

}
