import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chart-loader',
  templateUrl: './chart-loader.component.html',
  styleUrls: ['./chart-loader.component.css']
})
export class ChartLoaderComponent implements OnInit {

  @Input() chartName: string;
  constructor() { }

  ngOnInit() {
  }

}
