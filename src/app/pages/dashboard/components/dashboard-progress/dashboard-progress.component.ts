import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AppState} from '../../../../store/app.reducers';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {getVisualizationObjectsLoadingProgress} from '../../../../store/visualization/visualization.selectors';

@Component({
  selector: 'app-dashboard-progress',
  templateUrl: './dashboard-progress.component.html',
  styleUrls: ['./dashboard-progress.component.css'],
  animations: [
    trigger('open', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          transform: 'translateX(0) scale(0)'
        }),
        animate(800)
      ]),
      transition('* => void', [
        animate(800),
        style({
          transform: 'translateX(0) scale(0)'
        }),
      ])
    ])
  ]
})
export class DashboardProgressComponent implements OnInit {

  visualizationLoadingProgress$: Observable<any>;
  constructor(private store: Store<AppState>) {
    this.visualizationLoadingProgress$ = this.store.select(getVisualizationObjectsLoadingProgress);
  }

  ngOnInit() {
  }

}
