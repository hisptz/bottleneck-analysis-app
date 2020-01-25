import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-legend-color-picker',
  templateUrl: './legend-color-picker.component.html',
  styleUrls: ['./legend-color-picker.component.css']
})
export class LegendColorPickerComponent implements OnInit {
  @Input()
  color;

  @Output()
  colorSelect = new EventEmitter();

  constructor() {}

  onColorPickerSelect(color: string) {
    this.colorSelect.emit(color);
  }

  ngOnInit() {}
}
