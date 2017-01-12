import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'dashboard-pagination-control',
  templateUrl: './dashboard-menu-pagination.component.html',
  styleUrls: ['./dashboard-menu-pagination.component.css']
})
export class DashboardMenuPaginationComponent implements OnInit {

  @Input() id: string;
  @Input() maxSize: number;
  @Output() pageChange: EventEmitter<number>;
  constructor() { }

  ngOnInit() {
  }

}
