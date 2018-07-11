import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DashboardState, getCurrentDashboardVisualizations } from '../../store';

@Component({
  selector: 'app-current-dashboard',
  templateUrl: './current-dashboard.component.html',
  styleUrls: ['./current-dashboard.component.scss']
})
export class CurrentDashboardComponent implements OnInit {
  currentDashboardVisualizations$: Observable<Array<string>>;
  constructor(private store: Store<DashboardState>) {
    this.currentDashboardVisualizations$ = store.select(
      getCurrentDashboardVisualizations
    );
  }

  ngOnInit() {}
}
