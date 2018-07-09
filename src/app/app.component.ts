import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, LoadSystemInfo } from './store';

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
