import { Component, OnInit } from '@angular/core';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {userLastDashboardSelector} from '../store/selectors/user-last-dashboard.selector';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private store: Store<ApplicationState>,
    private router: Router
  ) { }

  ngOnInit() {
    this.store.select(userLastDashboardSelector).subscribe((lastDashboardId: string) => {
      if (lastDashboardId !== '') {
        this.router.navigate(['dashboards/' + lastDashboardId]);
      }
    })
  }

}
