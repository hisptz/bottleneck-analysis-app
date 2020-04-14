import { Component, OnInit, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { InterventionState } from '../../store/reducers/intervention.reducer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  LoadInterventions,
  CreateIntervention,
  UpdateIntervention,
  SaveIntervention,
  DeleteIntervention,
} from '../../store/actions';
import {
  getInterventionLoading,
  getInterventionLoaded,
  getSortedInterventions,
  getInterventionNotification,
} from '../../store/selectors/intervention.selectors';
import { Intervention } from '../../models';
import { DASHBOARD_ITEMS } from '../../constants/default-dashboard-items.constant';

interface DefaultDashboard {
  id: string;
  name: string;
  showEditForm?: boolean;
  showDeleteDialog?: boolean;
  dashboardItems: any[];
}

@Component({
  selector: 'app-default-interventions-dialog',
  templateUrl: './default-interventions-dialog.component.html',
  styleUrls: ['./default-interventions-dialog.component.css'],
})
export class DefaultInterventionsDialogComponent implements OnInit {
  showDefaultList: boolean;
  showInterventionForm: boolean;
  newInterventionName: string;
  savingIntervention: boolean;
  searchTerm: string;

  loadingInterventions$: Observable<boolean>;
  interventionLoaded$: Observable<boolean>;
  interventions$: Observable<any[]>;
  interventionNotification$: Observable<any>;
  constructor(
    private interventionStore: Store<InterventionState>,
    private dialogRef: MatDialogRef<DefaultInterventionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public interventionDialogData: any
  ) {}

  ngOnInit(): void {
    this.interventionStore.dispatch(new LoadInterventions());

    this.loadingInterventions$ = this.interventionStore.pipe(
      select(getInterventionLoading)
    );
    this.interventionLoaded$ = this.interventionStore.pipe(
      select(getInterventionLoaded)
    );
    this.interventions$ = this.interventionStore.pipe(
      select(getSortedInterventions)
    );
    this.interventionNotification$ = this.interventionStore.pipe(
      select(getInterventionNotification)
    );
  }

  onSearchIntervention(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value.trim();
  }

  onOpenInterventionForm(e) {
    if (e) {
      e.stopPropagation();
    }
    this.showInterventionForm = true;
  }

  onAddIntervention(intervention: any) {
    this.showInterventionForm = false;
    this.interventionStore.dispatch(new CreateIntervention(intervention));
  }

  onToggleInterventionEditForm(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }

    this.interventionStore.dispatch(
      new UpdateIntervention(intervention.id, {
        showEditForm: !intervention.showEditForm,
      })
    );
  }

  onUpdateIntervention(intervention: any) {
    this.interventionStore.dispatch(new SaveIntervention(intervention));
  }

  onToggleInterventionDelete(intervention: Intervention, e?) {
    if (e) {
      e.stopPropagation();
    }

    this.interventionStore.dispatch(
      new UpdateIntervention(intervention.id, {
        showDeleteDialog: !intervention.showDeleteDialog,
      })
    );
  }

  onDeleteIntervention(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.interventionStore.dispatch(new DeleteIntervention(intervention));
  }

  onAddDashboard(dashboard: DefaultDashboard, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showDefaultList = false;

    if (
      this.interventionDialogData &&
      this.interventionDialogData.appAuthorities &&
      (this.interventionDialogData.appAuthorities.All ||
        this.interventionDialogData.appAuthorities.AddIntervention)
    ) {
      this.dialogRef.close({
        dashboard: {
          ...dashboard,
          dashboardItems: dashboard.dashboardItems || DASHBOARD_ITEMS,
        },
        action: 'ADD',
      });
    }
  }

  onClose(e) {
    e.stopPropagation();
    this.dialogRef.close({
      action: 'CLOSE',
    });
  }
}
