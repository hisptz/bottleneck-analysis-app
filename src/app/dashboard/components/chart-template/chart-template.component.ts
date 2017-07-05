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
  @Input() chartHeight: string;
  @Input() chartObject: any;
  chart: any;
  constructor() { }

  ngOnInit() {
    if (this.chartObject) {
      setTimeout(() => {
        this.chart = Highcharts.chart(this.chartObject);
      }, 20)
    }
  }

  resize() {

  }

  reflow(shape, fullScreen?) {
    console.log(shape)
    setTimeout(() => {
      const chartDiv = document.getElementById(this.renderId)
      console.log(chartDiv.offsetWidth, chartDiv.offsetHeight)
      if (this.chart) {
        if (fullScreen) {
          this.chart.setSize(null, '91vh');
        } else {
          this.chart.setSize(null, '400');
        }
        this.chart.reflow();
      }
    }, 150)
  }

  findWidth(currentShape, currentWidth) {

  }
  getHeight(height) {
    console.log(height);
    return height
  }

}
