import {Component, HostListener, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppState} from './store/app.reducers';
import {Store} from '@ngrx/store';
import * as currentUser from './store/current-user/current-user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private titleService: Title,
    private store: Store<AppState>
  ) {
    store.dispatch(new currentUser.LoadAction());
  }

  ngOnInit() {
    this.setTitle('Interactive Dashboard 2');
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
}
