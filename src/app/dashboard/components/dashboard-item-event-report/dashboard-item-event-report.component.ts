import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-dashboard-item-event-report',
  templateUrl: './dashboard-item-event-report.component.html',
  styleUrls: ['./dashboard-item-event-report.component.css']
})
export class DashboardItemEventReportComponent implements OnInit {

  @Input() eventReportData: any;
  constructor() { }

  ngOnInit() {
  }

}
