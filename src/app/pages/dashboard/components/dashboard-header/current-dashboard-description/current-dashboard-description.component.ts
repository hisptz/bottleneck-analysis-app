import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-current-dashboard-description',
  templateUrl: './current-dashboard-description.component.html',
  styleUrls: ['./current-dashboard-description.component.css']
})
export class CurrentDashboardDescriptionComponent implements OnInit {

  @Input() currentDashboardDescription: string;
  constructor() { }

  ngOnInit() {
  }

}
