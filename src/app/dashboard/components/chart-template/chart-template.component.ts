import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
declare var Highcharts: any;

@Component({
  selector: 'app-chart-template',
  templateUrl: './chart-template.component.html',
  styleUrls: ['./chart-template.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartTemplateComponent implements OnInit {

  @Input() renderId: string;
  @Input() chartHeight
  @Input() chartObject: any;
  chart: any;
  constructor() { }

  ngOnInit() {
    if (this.chartObject) {
      setTimeout(() => {
        this.chart = Highcharts.chart(this.chartObject)
      }, 20)
    }
  }

  reflow() {
    setTimeout(() => {
      if (this.chart) {
        this.chart.reflow();
      }
    }, 100)
  }

}
