import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-legend-pattern-picker',
  templateUrl: './legend-pattern-picker.component.html',
  styleUrls: ['./legend-pattern-picker.component.css']
})
export class LegendPatternPickerComponent implements OnInit {
  @Input() selectedPattern: string;

  @Output() onPatternChange = new EventEmitter();
  cities = [
    {
      id: 'circlePattern',
      name: 'circle',
      avatar: 'assets/icons/circlePattern.png'
    },
    { id: 'checkerboardPattern', name: 'checker', avatar: 'assets/icons/checkerboardPattern.png' },
    { id: 'stripePattern', name: 'stripe', avatar: 'assets/icons/stripePattern.png' },
    {
      id: 'rectPattern',
      name: 'rectangle',
      avatar: 'assets/icons/rectPattern.png'
    },
    {
      id: 'linesPattern',
      name: 'lines',
      avatar: 'assets/icons/linesPattern.png'
    },
    {
      id: 'trianglePattern',
      name: 'triangle',
      avatar: 'assets/icons/trianglePattern.png'
    },
    {
      id: 'chevronPattern',
      name: 'chevron',
      avatar: 'assets/icons/chevronPattern.png'
    }
  ];
  constructor() {}

  ngOnInit() {}

  onChange(pattern) {
    this.onPatternChange.emit(pattern.id);
  }
}
