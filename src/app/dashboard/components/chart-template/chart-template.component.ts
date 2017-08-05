import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
declare var Highcharts: any;

@Component({
  selector: 'app-chart-template',
  templateUrl: './chart-template.component.html',
  styleUrls: ['./chart-template.component.css']
})
export class ChartTemplateComponent implements OnInit {

  @Input() renderId: string;
  @Input() chartHeight: string;
  @Input() chartObject: any;
  @Output() onChartRenderFailure: EventEmitter<string> = new EventEmitter<string>();
  chart: any;
  constructor() { }

  ngOnInit() {
    if (this.chartObject) {
      setTimeout(() => {
        if (this.chartObject.series) {
          this.chart = Highcharts.chart(this.chartObject);
        } else {
          this.onChartRenderFailure.emit('Required properties for rendering  are missing')
        }
      }, 20)
    }
  }

  download(filename, downloadFormat) {
    if (this.chart) {
      if (downloadFormat === 'pdf') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'application/pdf'})
      } else if (downloadFormat === 'png') {
        this.chart.exportChartLocal({'filename': filename, 'type': 'image/png'})
      }
    }
  }

  reflow(shape, fullScreen?) {
    setTimeout(() => {
      const fullScreenWidth: number = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 90;
      if (this.chart) {
        if (fullScreen) {
          const fullScreenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 95;
          this.chart.setSize(fullScreenWidth, fullScreenHeight);
        } else {
          this.chart.setSize(this.computeWidth(shape, fullScreenWidth), '400');
        }
        this.chart.reflow();
      }
    }, 150)
  }

  computeWidth(currentShape: string, fullScreenWidth: number) {
    let newWidth: number = -40;
    if (currentShape === 'NORMAL') {
      if (fullScreenWidth > 1000) {
        newWidth += fullScreenWidth/3;
      } else if (fullScreenWidth > 750 && fullScreenWidth < 960) {
        newWidth += fullScreenWidth/2;
      } else {
        newWidth += fullScreenWidth;
      }

    } else if (currentShape === 'DOUBLE_WIDTH') {
      if (fullScreenWidth > 1000) {
        newWidth += fullScreenWidth * 0.67;
      } else if (fullScreenWidth > 750 && fullScreenWidth < 960) {
        newWidth += fullScreenWidth/2;
      } else {
        newWidth += fullScreenWidth;
      }
    } else {
      newWidth += fullScreenWidth;
    }
    return newWidth.toFixed(0);
  }

}
