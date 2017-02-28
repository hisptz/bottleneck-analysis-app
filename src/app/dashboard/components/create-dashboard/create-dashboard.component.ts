import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from "@angular/forms";
import {Dashboard} from "../../interfaces/dashboard";
import {DashboardService} from "../../providers/dashboard.service";
import {Router} from "@angular/router";
import {DashboardSettingsService} from "../../providers/dashboard-settings.service";

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {

  @Output() onCreateSuccess: EventEmitter<any> = new EventEmitter<any>();
  public createDashboardForm: FormGroup;
  public submitted: boolean;
  public isAddFormOpen : boolean;
  constructor(
      private formGroup: FormBuilder,
      private dashboardService: DashboardService,
      private router: Router,
      private settingService: DashboardSettingsService
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
    this.settingService.toggleItem('add-dashboard');
    this.createDashboardForm.reset();
    this.dashboardService.create(dashboardData).subscribe(dashboardId => {
      this.onCreateSuccess.emit(dashboardId);
      this.router.navigate(['/dashboards/' + dashboardId +'/dashboard']);
      this.submitted = false;
    });
  }


}
