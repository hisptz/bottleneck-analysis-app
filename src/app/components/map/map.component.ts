import {Component, OnInit, Input} from '@angular/core';
import {Visualization} from "../../model/visualization";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() mapData: Visualization;
  constructor() { }

  ngOnInit() {
  }

}
