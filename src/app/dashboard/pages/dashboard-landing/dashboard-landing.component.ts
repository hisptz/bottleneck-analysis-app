import {Component, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {DashboardService} from "../../providers/dashboard.service";
import {Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

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
        this.router.navigate(['dashboards/'+ dashboards[0].id + '/dashboard']);
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
