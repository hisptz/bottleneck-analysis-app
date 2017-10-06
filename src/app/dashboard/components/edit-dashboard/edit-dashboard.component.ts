import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dashboard} from '../../../model/dashboard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {EditDashboardAction} from '../../../store/actions';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';

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
    private store: Store<ApplicationState>
  ) { }

  ngOnInit() {
    this.editDashboardForm = this.formGroup.group({
      id: [this.dashboard.id],
      name: [this.dashboard.name, [Validators.required, Validators.minLength(3)]]
    })
  }

  closeForm() {
    this.onUpdateSuccess.emit(true);
  }

  save(dashboardData: any, isValid: boolean) {
    this.submitted = true;
    this.store.dispatch(new EditDashboardAction(dashboardData));
    this.closeForm();
  }
}
