import { Component, OnInit, Input } from '@angular/core';
import { Legend } from 'src/app/models/legend.model';

@Component({
  selector: 'app-legend-list',
  templateUrl: './legend-list.component.html',
  styleUrls: ['./legend-list.component.scss'],
})
export class LegendListComponent implements OnInit {
  @Input() legends: Legend[];
  constructor() {}

  ngOnInit() {}
}
