import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {Dashboard} from "../../interfaces/dashboard";
import {DashboardService} from "../../providers/dashboard.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {

  public createDashboardForm: FormGroup;
  public submitted: boolean;
  public isAddFormOpen : boolean;
  constructor(
      private formGroup: FormBuilder,
      private dashboardService: DashboardService,
      private router: Router
  ) {
    this.isAddFormOpen = false;
    this.submitted = false;
  }

  ngOnInit() {
    this.createDashboardForm = this.formGroup.group({
      name: ['',[Validators.required,Validators.minLength(3)]]
    })
  }

  save(dashboardData: Dashboard, isValid: boolean) {
    this.submitted = true;
    this.isAddFormOpen = false;
    this.createDashboardForm.reset();
    this.dashboardService.create(dashboardData).subscribe(dashboardId => {
      this.router.navigate(['/dashboards/' + dashboardId +'/dashboard']);
      this.submitted = false;
    });
  }


}
