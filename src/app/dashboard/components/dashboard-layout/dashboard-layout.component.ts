import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {isArray} from "util";

export interface Header {
  name: string;
  column:string;
  type?:string;
  hidden?:boolean;
  meta?:boolean;
}

export interface Configuration {
  multiple: boolean;
}

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {

  @Input() layout: any;
  @Input() visualizationType: string;
  @Output() onUpdate = new EventEmitter();
  showLayout: boolean = false;
  isOpen = false;
  constructor() { }

  names = {
  }
  icons = {
    dx:"fa-database",
    ou:"fa-sitemap",
    pe:"fa-calendar-check-o",
  }
  dimensions = {
    filterDimension: [],
    columnDimension: [],
    rowDimension: []
  }
  layoutType: string;

  ngOnInit() {
    this.changeVisualisation(this.visualizationType);
  }
  @Output('drop') drop = new EventEmitter();

  onDrop(event, dimension) {
    if(isArray(this.layout[event.dragData.dimension])) {
      this.layout[event.dragData.dimension].splice(this.layout[event.dragData.dimension].indexOf(event.dragData.data),1);
    } else {
      this.layout[event.dragData.dimension];
    }
    if(dimension == 'category' || dimension == 'series') {
      if(this.layout[dimension] != "") {
        if(isArray(this.layout[event.dragData.dimension])) {
          this.layout[event.dragData.dimension].push(this.layout[dimension])
        } else {
          this.layout[event.dragData.dimension] = this.layout[dimension];
        }
      }
      this.layout[dimension] = event.dragData.data;
    } else {
      this.layout[dimension].push(event.dragData.data)
    }
  }

  changeVisualisation(visualizationType, headers = []) {
    if((visualizationType == 'CHART') || (visualizationType == 'EVENT_CHART')) {
      this.layoutType ='chart';
    } else {
      this.layoutType ='table';
    }
  }

  updateDimension(headers) {
    this.dimensions = {
      filterDimension: [],
      columnDimension: [],
      rowDimension: []
    }
    headers.forEach((header,index)=>{
      if(header.name != "value"){
        if(this.dimensions.columnDimension.length == 0){
          this.dimensions.columnDimension.push(header.name);
        }else if(this.dimensions.rowDimension.length == 0){
          this.dimensions.rowDimension.push(header.name);
        }else{
          this.dimensions.filterDimension.push(header.name);
        }
        this.names[header.name] = {name:header.column,icon:"fa-database"};
        if(this.icons[header.name]){
          this.names[header.name].icon = this.icons[header.name];
        }
      }
    });
    console.log(this.dimensions)
  }
  updateLayout() {
    this.onUpdate.emit(this.dimensions);
  }


}
