import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';

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

  @Input() headers:Array<Header>;
  @Input() visualizationType: string;
  @Output() onUpdate = new EventEmitter();

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
    this.updateDimension(this.headers)
  }
  @Output('drop') drop = new EventEmitter();

  onDrop(event, dimension) {
    this.dimensions[event.dragData.dimension].splice(this.dimensions[event.dragData.dimension].indexOf(event.dragData.data),1);
    this.dimensions[dimension].push(event.dragData.data)
  }

  changeVisualisation(visualizationType, headers = []) {
    if((visualizationType == 'CHART') || (visualizationType == 'EVENT_CHART')) {
      this.layoutType ='chart';
    } else {
      this.layoutType ='table';
    }

    if(headers) {
      this.updateDimension(headers);
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
  }
  updateLayout() {
    this.isOpen = false;
    this.onUpdate.emit(this.dimensions);
  }

}
