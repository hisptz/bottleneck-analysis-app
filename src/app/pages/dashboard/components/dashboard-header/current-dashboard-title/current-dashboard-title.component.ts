import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-current-dashboard-title',
  templateUrl: './current-dashboard-title.component.html',
  styleUrls: ['./current-dashboard-title.component.css']
})
export class CurrentDashboardTitleComponent implements OnInit {

  @Input() currentDashboardTitle: string;
  constructor() { }

  ngOnInit() {
  }

}
