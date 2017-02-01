import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Dashboard} from "../../interfaces/dashboard";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {DashboardService} from "../../providers/dashboard.service";

@Component({
  selector: 'app-edit-dashboard',
  templateUrl: './edit-dashboard.component.html',
  styleUrls: ['./edit-dashboard.component.css']
})
export class EditDashboardComponent implements OnInit {

  @Input() dashboard: Dashboard;
  @Output() onFormClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  public editDashboardForm: FormGroup;
  public submitted: boolean;
  constructor(
    private formGroup: FormBuilder,
    private dashboardService: DashboardService
  ) {
    this.submitted = false;
  }

  ngOnInit() {
    this.editDashboardForm = this.formGroup.group({
      id: [this.dashboard.id],
      name: [this.dashboard.name,[Validators.required,Validators.minLength(3)]]
    })
  }

  save(dashboardData: Dashboard, isValid: boolean) {
    this.closeForm();
    this.dashboardService.update(dashboardData).subscribe(response => {});
  }

  closeForm() {
    this.onFormClosed.emit(true);
  }

}
