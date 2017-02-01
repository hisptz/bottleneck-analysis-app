import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-dashboard-item-resources',
  templateUrl: './dashboard-item-resources.component.html',
  styleUrls: ['./dashboard-item-resources.component.css']
})
export class DashboardItemResourcesComponent implements OnInit {

  @Input() resourceData: any;
  constructor() { }

  ngOnInit() {
  }

}
