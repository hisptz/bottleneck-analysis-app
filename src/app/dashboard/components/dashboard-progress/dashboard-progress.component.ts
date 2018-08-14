import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-progress',
  templateUrl: './dashboard-progress.component.html',
  styleUrls: ['./dashboard-progress.component.scss']
})
export class DashboardProgressComponent implements OnInit {
  @Input()
  borderRadius: string;

  @Input()
  height: string;
  constructor() {
    this.height = '100%';
  }

  ngOnInit() {}
}
