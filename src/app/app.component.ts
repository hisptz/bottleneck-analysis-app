import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/index';
import { LoadCurrentUser } from './actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: Store<State>) {

    // Load current user information
    store.dispatch(new LoadCurrentUser());
  }
}
