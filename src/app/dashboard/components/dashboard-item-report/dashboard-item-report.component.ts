import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-dashboard-item-report',
  templateUrl: './dashboard-item-report.component.html',
  styleUrls: ['./dashboard-item-report.component.css']
})
export class DashboardItemReportComponent implements OnInit {

  @Input() reportData: any;
  constructor() { }

  ngOnInit() {
  }

}
