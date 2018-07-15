import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import {
  DashboardState,
  getCurrentDashboardVisualizations,
  getCurrentDashboard
} from '../../store';
import { Dashboard } from '../../models';

@Component({
  selector: 'app-current-dashboard',
  templateUrl: './current-dashboard.component.html',
  styleUrls: ['./current-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardComponent implements OnInit {
  currentDashboardVisualizations$: Observable<Array<string>>;
  currentDashboard$: Observable<Dashboard>;
  constructor(private store: Store<DashboardState>) {
    this.currentDashboardVisualizations$ = store.select(
      getCurrentDashboardVisualizations
    );

    this.currentDashboard$ = store.select(getCurrentDashboard);
  }

  ngOnInit() {}
}
