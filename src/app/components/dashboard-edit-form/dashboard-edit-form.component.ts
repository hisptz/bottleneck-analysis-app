import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {UpdateDashboardAction} from "../../store/actions";

@Component({
  selector: 'app-dashboard-edit-form',
  templateUrl: './dashboard-edit-form.component.html',
  styleUrls: ['./dashboard-edit-form.component.css']
})
export class DashboardEditFormComponent implements OnInit {

  @Input() dashboard: any;
  @Output() onEditSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCloseAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  public editDashboardForm: FormGroup;
  public submitted: boolean;
  constructor(
    private formGroup: FormBuilder,
    private store: Store<ApplicationState>
  ) { }

  ngOnInit() {
    this.editDashboardForm = this.formGroup.group({
      name: [this.dashboard.name,[Validators.required,Validators.minLength(3)]],
      id: [this.dashboard.id]
    })
  }

  save(dashboardFormObject: any, isValid: boolean) {
    console.log(dashboardFormObject)
    this.submitted = true;
    this.store.dispatch(new UpdateDashboardAction(dashboardFormObject));
    this.onEditSuccess.emit(true);
  }

  closeForm() {
    this.onCloseAction.emit(true);
    this.submitted = false;
  }

}
