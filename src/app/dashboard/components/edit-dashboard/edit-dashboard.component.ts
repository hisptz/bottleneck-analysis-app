import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Dashboard} from "../../interfaces/dashboard";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {DashboardService} from "../../providers/dashboard.service";
import {NotificationService} from "../../../shared/providers/notification.service";

@Component({
  selector: 'app-edit-dashboard',
  templateUrl: './edit-dashboard.component.html',
  styleUrls: ['./edit-dashboard.component.css']
})
export class EditDashboardComponent implements OnInit {

  @Input() dashboard: Dashboard;
  @Output() onUpdateSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  public editDashboardForm: FormGroup;
  public submitted: boolean;
  constructor(
    private formGroup: FormBuilder,
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {
    this.submitted = false;
  }

  ngOnInit() {
    this.editDashboardForm = this.formGroup.group({
      name: [this.dashboard.name,[Validators.required,Validators.minLength(3)]]
    })
  }

  save(dashboardFormObject: any, isValid: boolean) {
    this.submitted = true;
    this.dashboardService.updateDashboardName(dashboardFormObject.name, this.dashboard.id)
      .subscribe(response => {
        this.closeForm();
      }, error => {
        console.log('error uppdating dashboard')
      });
  }

  closeForm() {
    this.onUpdateSuccess.emit(true);
    this.submitted = false;
  }

}
