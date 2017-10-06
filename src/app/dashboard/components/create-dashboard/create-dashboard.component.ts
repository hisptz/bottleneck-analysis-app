import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Dashboard} from '../../../model/dashboard';
import {ApplicationState} from '../../../store/application-state';
import {Store} from '@ngrx/store';
import {CreateDashboardAction} from '../../../store/actions';

@Component({
  selector: 'app-create-dashboard',
  templateUrl: './create-dashboard.component.html',
  styleUrls: ['./create-dashboard.component.css']
})
export class CreateDashboardComponent implements OnInit {

  createDashboardForm: FormGroup;
  submitted: boolean = false;
  @Output() onDashboardCreate: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private store: Store<ApplicationState>,
    private formGroup: FormBuilder,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      document.getElementById('dashboard_add_input').focus();
    }, 10);

    this.createDashboardForm = this.formGroup.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  save(dashboardData: Dashboard) {
    this.submitted = true;
    this.createDashboardForm.reset();
    this.store.dispatch(new CreateDashboardAction(dashboardData));
    this.onDashboardCreate.emit(true)
  }
}
