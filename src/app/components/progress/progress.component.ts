import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {progressMessagesSelector} from '../../store/selectors/progress-message.selector';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {

  progressMessages$: Observable<any>;
  constructor(private store: Store<ApplicationState>) {
    this.progressMessages$ = store.select(progressMessagesSelector)
  }

  ngOnInit() {
  }

}
