import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-current-dashboard-description',
  templateUrl: './current-dashboard-description.component.html',
  styleUrls: ['./current-dashboard-description.component.scss']
})
export class CurrentDashboardDescriptionComponent implements OnInit {
  @Input()
  dashboardDescription: string;
  @Input()
  globalFilter: any;
  @Input()
  dashboardId: string;
  constructor() {}

  ngOnInit() {}
}
