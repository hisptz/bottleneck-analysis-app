import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {DashboardService} from "../../services/dashboard.service";
import {Router} from "@angular/router";
import {Dashboard} from "../../model/dashboard";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {AddDashboardAction} from "../../store/actions";
import {currentCreatedDashboardSelector} from "../../store/selectors/current-created-dashboard.selector";

@Component({
  selector: 'app-dashboard-add-form',
  templateUrl: './dashboard-add-form.component.html',
  styleUrls: ['./dashboard-add-form.component.css']
})
export class DashboardAddFormComponent implements OnInit {

  @Output() onCreateSuccess: EventEmitter<any> = new EventEmitter<any>();
  public createDashboardForm: FormGroup;
  public submitted: boolean;
  public isAddFormOpen : boolean;
  constructor(
    private formGroup: FormBuilder,
    private dashboardService: DashboardService,
    private router: Router,
    private store: Store<ApplicationState>
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
    // this.settingService.toggleItem('add-dashboard');
    this.createDashboardForm.reset();
    this.store.dispatch(new AddDashboardAction(dashboardData.name));

    this.store.select(currentCreatedDashboardSelector).subscribe(dashboardId => {
      if(dashboardId != null) {
        this.submitted = false;
        this.router.navigate(['/dashboards/' + dashboardId]);
      }
    });

    // this.dashboardService.create(dashboardData).subscribe((dashboard: any) => {
    //   this.onCreateSuccess.emit(dashboard.id);
    //   this.router.navigate(['/dashboards/' + dashboard.id +'/dashboard']);
    //   this.submitted = false;
    // });
  }
}
