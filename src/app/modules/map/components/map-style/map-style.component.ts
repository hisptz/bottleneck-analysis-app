import { Component, OnInit } from '@angular/core';
import { colorBrewer } from '../../utils/colorBrewer';

@Component({
  selector: 'app-map-style',
  templateUrl: './map-style.component.html',
  styleUrls: ['./map-style.component.css']
})
export class MapStyleComponent implements OnInit {
  classifications = [{ method: 2, name: 'Equal interval' }, { method: 2, name: 'Equal counts' }];
  classes = [3, 4, 5, 6, 7, 8, 9];
  default_color = 'PuBu';
  dropDownIsOpen = false;
  default_class = 3;
  colors = Object.keys(colorBrewer);
  constructor() {}

  ngOnInit() {}

  onChange(classfication) {
    console.log(classfication);
  }

  onChangeClass(classSize) {
    this.default_class = classSize;
  }

  onChangeColor(colorDefault) {
    this.default_color = colorDefault;
  }

  toggleDropDown() {
    this.dropDownIsOpen = !this.dropDownIsOpen;
  }

  getColors(key, classSize) {
    return colorBrewer[key][classSize];
  }
}
