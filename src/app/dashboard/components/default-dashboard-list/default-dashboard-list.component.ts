import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';

import * as fromInterventionReducer from '../../store/reducers/intervention.reducer';
import * as fromInterventionActions from '../../store/actions/intervention.actions';
import * as fromInterventionSelectors from '../../store/selectors/intervention.selectors';
import { Observable } from 'rxjs';
import { Intervention } from '../../models/intervention.model';

interface DefaultDashboard {
  id: string;
  name: string;
  showEditForm?: boolean;
  showDeleteDialog?: boolean;
}

@Component({
  selector: 'app-default-dashboard-list',
  templateUrl: './default-dashboard-list.component.html',
  styleUrls: ['./default-dashboard-list.component.scss']
})
export class DefaultDashboardListComponent implements OnInit {
  @Input()
  defaultDashboardList: DefaultDashboard[];
  showDefaultList: boolean;
  showInterventionForm: boolean;
  newInterventionName: string;
  savingIntervention: boolean;
  searchTerm: string;

  loadingInterventions$: Observable<boolean>;
  interventionLoaded$: Observable<boolean>;
  interventions$: Observable<any[]>;
  interventionNotification$: Observable<any>;

  @Output()
  create: EventEmitter<any> = new EventEmitter<any>();
  constructor(private interventionStore: Store<fromInterventionReducer.State>) {
    interventionStore.dispatch(new fromInterventionActions.LoadInterventions());

    this.loadingInterventions$ = interventionStore.select(
      fromInterventionSelectors.getInterventionLoading
    );

    this.interventionLoaded$ = interventionStore.select(
      fromInterventionSelectors.getInterventionLoaded
    );

    this.interventions$ = interventionStore.select(
      fromInterventionSelectors.getSortedInterventions
    );

    this.interventionNotification$ = interventionStore.select(
      fromInterventionSelectors.getInterventionNotification
    );
  }

  ngOnInit() {}

  onSearchDashboard(e) {
    e.stopPropagation();
    this.searchTerm = e.target.value.trim();
    this.showDefaultList = true;
  }

  onAddDashboard(dashboard: DefaultDashboard, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showDefaultList = false;
    this.create.emit(dashboard);
  }

  onToggleInterventionList(e) {
    e.stopPropagation();
    this.showDefaultList = !this.showDefaultList;
  }

  onOpenInterventionList(e) {
    e.stopPropagation();
    this.showDefaultList = true;
  }

  onToggleInterventionForm(e?) {
    if (e) {
      e.stopPropagation();
    }
    this.showInterventionForm = !this.showInterventionForm;
  }

  onToggleInterventionEditForm(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }

    this.interventionStore.dispatch(
      new fromInterventionActions.UpdateIntervention(intervention.id, {
        showEditForm: !intervention.showEditForm
      })
    );
  }

  onToggleInterventionDelete(intervention: Intervention, e?) {
    if (e) {
      e.stopPropagation();
    }

    this.interventionStore.dispatch(
      new fromInterventionActions.UpdateIntervention(intervention.id, {
        showDeleteDialog: !intervention.showDeleteDialog
      })
    );
  }

  onEnterInterventionName(e) {
    e.stopPropagation();
    this.newInterventionName = e.target.value.trim();
  }

  onAddIntervention(intervention: any) {
    this.showInterventionForm = false;
    this.interventionStore.dispatch(
      new fromInterventionActions.CreateIntervention(intervention)
    );
  }

  onUpdateIntervention(intervention: any) {
    this.interventionStore.dispatch(
      new fromInterventionActions.SaveIntervention(intervention)
    );
  }

  onDeleteIntervention(intervention, e?) {
    if (e) {
      e.stopPropagation();
    }
    this.interventionStore.dispatch(
      new fromInterventionActions.DeleteIntervention(intervention)
    );
  }
}
