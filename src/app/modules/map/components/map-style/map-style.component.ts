import { Component, OnInit } from '@angular/core';
import { colorBrewer } from '../../utils/colorBrewer';

@Component({
  selector: 'app-map-style',
  templateUrl: './map-style.component.html',
  styleUrls: ['./map-style.component.css']
})
export class MapStyleComponent implements OnInit {
  classifications = ['Equal interval', 'Equal counts'];
  classes = [3, 4, 5, 6, 7, 8, 9];
  default_color = 'PuBu';
  default_class = 3;
  colors = Object.keys(colorBrewer);
  constructor() {}

  ngOnInit() {}

  onChange(deviceValue) {
    console.log(deviceValue);
  }

  getColors(key, classSize) {
    return colorBrewer[key][classSize];
  }
}
