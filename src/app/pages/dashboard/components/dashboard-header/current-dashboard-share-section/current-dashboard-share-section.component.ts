import { SharingEntity } from './../../../../../modules/sharing-filter/models/sharing-entity';
import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/app.reducers';
import { Observable } from 'rxjs/Observable';
import { DashboardSharing } from '../../../../../store/dashboard/dashboard.state';
import * as dashboardSelectors from '../../../../../store/dashboard/dashboard.selectors';
import * as dashboardActions from '../../../../../store/dashboard/dashboard.actions';

@Component({
  selector: 'app-current-dashboard-share-section',
  templateUrl: './current-dashboard-share-section.component.html',
  styleUrls: ['./current-dashboard-share-section.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(400),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class CurrentDashboardShareSectionComponent implements OnInit {
  showShareBlock: boolean;
  currentDashboardSharing$: Observable<DashboardSharing>;
  constructor(private store: Store<AppState>) {
    this.showShareBlock = false;
    this.currentDashboardSharing$ = store.select(
      dashboardSelectors.getCurrentDashboardSharing
    );
  }

  ngOnInit() {}

  toggleShareBlock(e?) {
    if (e) {
      e.stopPropagation();
    }

    this.showShareBlock = !this.showShareBlock;
  }

  onSharingUpdate(sharingEntity: SharingEntity) {
    this.store.dispatch(
      new dashboardActions.UpdateSharingDataAction(sharingEntity)
    );
  }
}
