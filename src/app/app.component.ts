import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './reducers/index';
import { LoadSystemInfo } from './actions/system-info.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: Store<State>) {

    // Load system information
    store.dispatch(new LoadSystemInfo());
  }
}
