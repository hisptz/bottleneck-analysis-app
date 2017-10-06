import {Component, OnInit} from '@angular/core';
import {ApplicationState} from './store/application-state';
import {Store} from '@ngrx/store';
import {
  LoadSystemInfoAction
} from './store/actions';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<ApplicationState>,
    private titleService: Title
  ) {
    store.dispatch(new LoadSystemInfoAction());
  }

  ngOnInit() {
    this.setTitle('Interactive Dashboard 2');
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }
}
