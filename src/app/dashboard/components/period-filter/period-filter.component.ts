import {Component, OnInit, forwardRef, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TreeComponent, IActionMapping, TREE_ACTIONS} from "angular2-tree-component";
import {FilterService} from "../../providers/filter.service";

const actionMapping1:IActionMapping = {
  mouse: {
    click: (node, tree, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
    }
  }
};

const actionMapping:IActionMapping = {
  mouse: {
    dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
    click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
  }
};


@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.css']
})
export class PeriodFilterComponent implements OnInit {

  periods = [];
  period: any = {};
  showPerTree:boolean = true;
  @Input() selected_periods:any[] = [];
  period_type: string = "Quarterly";
  year: number = 2016;
  default_period: string[] = [];
  @Output() onPeriodUpdate: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('pertree')
  pertree: TreeComponent;
  period_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: false,
    loading_message: 'Loading Periods...',
    multiple: true,
    placeholder: "Select period"
  };
  constructor(private filterService: FilterService) {
  }

  ngOnInit() {

  }

  activateNode(nodeId:any, nodes){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.toggleActivated();
    }, 0);
  }

  pushPeriodForward(){
    this.year += 1;
    this.periods = this.filterService.getPeriodArray(this.period_type,this.year);
  }

  pushPeriodBackward(){
    this.year -= 1;
    this.periods = this.filterService.getPeriodArray(this.period_type,this.year);
  }

  changePeriodType(){
    this.periods = this.filterService.getPeriodArray(this.period_type,this.year);
  }

  //setting the period to next or previous
  setPeriod(type){
    if(type == "down"){
      this.periods = this.filterService.getPeriodArray(this.period_type, this.filterService.getLastPeriod(this.period.id,this.period_type).substr(0,4));
      this.activateNode(this.filterService.getLastPeriod(this.period.id,this.period_type), this.pertree);
      this.period = {
        id:this.filterService.getLastPeriod(this.period.id,this.period_type),
        name:this.getPeriodName(this.filterService.getLastPeriod(this.period.id,this.period_type))
      };

    }
    if(type == "up"){
      this.periods = this.filterService.getPeriodArray(this.period_type, this.filterService.getNextPeriod(this.period.id,this.period_type).substr(0,4));
      this.activateNode(this.filterService.getNextPeriod(this.period.id,this.period_type), this.pertree);
      this.period = {
        id:this.filterService.getNextPeriod(this.period.id,this.period_type),
        name:this.getPeriodName(this.filterService.getNextPeriod(this.period.id,this.period_type))
      };

    }
    setTimeout(() => {
      // this.loadScoreCard()
    }, 5);
  }

  // get the name of period to be used in a tittle
  getPeriodName(id){
    for ( let period of this.filterService.getPeriodArray(this.period_type, this.filterService.getLastPeriod(id,this.period_type).substr(0,4))){
      if( this.filterService.getLastPeriod(id,this.period_type) == period.id){
        return period.name;
      }
    }
  }

  // custom settings for tree
  customTemplateStringPeriodOptions: any = {actionMapping};

  // display period Tree
  displayPerTree(){
    this.showPerTree = !this.showPerTree;
  }

  // action to be called when a tree item is deselected(Remove item in array of selected items
  deactivatePer ( $event ) {
    this.selected_periods.splice(this.selected_periods.indexOf($event.node.data),1)
  };

  // add item to array of selected items when item is selected
  activatePer($event) {
    this.selected_periods.push($event.node.data);
    this.period = $event.node.data;
  };

  updatePeriodModel() {
    console.log(this.selected_periods)
    this.displayPerTree();
    this.onPeriodUpdate.emit({name: 'pe', value: this.getPeriodsForAnalytics(this.selected_periods)});
  }

  getPeriodsForAnalytics(selectedPeriod) {
    let periodForAnalytics = "";
    selectedPeriod.forEach((periodValue, periodIndex) => {
      periodForAnalytics += periodIndex == 0 ? periodValue.id : ';' + periodValue.id;
    })
    return periodForAnalytics
  }

}
