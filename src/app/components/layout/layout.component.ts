import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {isArray} from "rxjs/util/isArray";

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
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @Input() layout = {
    rows: ['pe'],
    columns: ['dx'],
    filters: ['ou'],
    excluded: []
  };
  @Input() visualizationType: string;
  @Output() onLayoutUpdate = new EventEmitter();
  showLayout: boolean = false;
  isOpen = false;
  constructor() { }

  names = {
    dx: 'Data',
    ou: 'Organisation Unit',
    pe: 'Period',
    co: 'Category Option'
  };
  icons = {
    dx:"glyphicon glyphicon-oil",
    ou:"glyphicon glyphicon-home",
    pe:"glyphicon glyphicon-calendar",
    co:"glyphicon glyphicon-align-justify",
  };

  dimensions = {
    filterDimension: [],
    columnDimension: [],
    rowDimension: []
  };
  layoutType: string;

  ngOnInit() {
    this.changeVisualisation(this.visualizationType);
  }
  @Output('drop') drop = new EventEmitter();

  onDrop(event, dimension) {
    if(isArray(this.layout[event.dragData.dimension])) {
      this.layout[event.dragData.dimension].splice(this.layout[event.dragData.dimension].indexOf(event.dragData.data),1);
    }

    if(dimension == 'category' || dimension == 'series') {
      if(this.layout[dimension] != "") {
        //first send target value to the dropper
        if(isArray(this.layout[event.dragData.dimension])) {
          this.layout[event.dragData.dimension].push(this.layout[dimension])
        } else {
          this.layout[event.dragData.dimension] = this.layout[dimension];
        }
      }
      this.layout[dimension] = event.dragData.data;
    } else {
      if(event.dragData.dimension == 'category' || event.dragData.dimension == 'series') {
        this.layout[event.dragData.dimension] = "";
      }
      this.layout[dimension].push(event.dragData.data)
    }

    // this.onLayoutUpdate.emit(this.layout);
  }

  changeVisualisation(visualizationType, headers = []) {
    console.log(visualizationType)
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
    };
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
  }
  updateLayout() {
    this.showLayout = false;
    this.onLayoutUpdate.emit(this.layout);
  }
}
