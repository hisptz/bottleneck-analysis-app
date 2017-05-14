import {Component, OnInit, Output, Input, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import {TREE_ACTIONS, IActionMapping} from "angular-tree-component/dist/models/tree-options.model";
import {TreeComponent} from "angular-tree-component/dist/components/tree.component";


const PERIOD_TYPE: Array<any> = [
  {value:'Monthly', name: 'Monthly', shown: true},
  {value:'BiMonthly', name: 'BiMonthly', shown: false},
  {value:'Quarterly', name: 'Quarterly', shown: false},
  {value:'SixMonthly', name: 'Six-Monthly', shown: false},
  {value:'SixMonthlyApril', name: 'Six-Monthly April', shown: false},
  {value:'Yearly', name: 'Yearly', shown: true},
  {value:'FinancialApril', name: 'Financial-April', shown: false},
  {value:'FinancialJuly', name: 'Financial-July', shown: false},
  {value:'FinancialOct', name: 'Financial-Oct', shown: false},
];


@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.css']
})
export class PeriodFilterComponent implements OnInit, AfterViewInit {


  @Input() period_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: false,
    loading_message: 'Loading Periods...',
    multiple: false,
    multiple_key:"none", //can be control or shift
    starting_periods: [],
    starting_year: null,
    placeholder: "Select period"
  };
  @Input() disabled: boolean = false;
  selected_periods:any[] = [];
  @Output() onPeriodUpdate: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('pertree')
  pertree: TreeComponent;
  periods = [];
  period: any = {};
  showPerTree:boolean = true;
  period_type: string = 'Monthly';
  year: number = 2016;
  default_period: string[] = [];
  customTemplateStringOrgunitOptions: any;
  period_type_config: Array<any>;

  constructor() {
    let date = new Date();
    date.setDate(0);
    this.period_tree_config.starting_year = date.getFullYear();
    this.year = (this.period_tree_config.starting_year)?this.period_tree_config.starting_year:date.getFullYear();
    let datestring = date.getFullYear() + ("0"+(date.getMonth()+1)).slice(-2);
    this.period_tree_config.starting_periods=[datestring];
    if(!this.period_tree_config.hasOwnProperty("multiple_key")){
      this.period_tree_config.multiple_key = "none";
    }
  }


  ngOnInit() {
    this.period_type_config = PERIOD_TYPE;
    if(this.period_type != '') {
      this.changePeriodType();
    }

    if(this.period_tree_config.multiple) {
      if(this.period_tree_config.multiple_key == "none"){
        let actionMapping:IActionMapping = {
          mouse: {
            dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};

      }
      // multselect using control key
      else if(this.period_tree_config.multiple_key == "control"){
        let actionMapping:IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.ctrlKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }
      // multselect using shift key
      else if(this.period_tree_config.multiple_key == "shift"){
        let actionMapping:IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }

    }else{
      let actionMapping:IActionMapping = {
        mouse: {
          dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
          click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
        }
      };
      this.customTemplateStringOrgunitOptions = {actionMapping};
    }
  }

  ngAfterViewInit(){
    for( let period of this.period_tree_config.starting_periods ){
      this.activateNode(period,this.pertree);
    }
  }


  activateNode(nodeId:any, nodes){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.setIsActive(true, true);
    }, 0);
  }

  // a method to activate the model
  deActivateNode(nodeId:any, nodes, event){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node){
        node.setIsActive(false, true);
      }
    }, 0);
    if( event != null){
      event.stopPropagation();
    }
  }

  pushPeriodForward(){
    this.year += 1;
    this.periods = this.getPeriodArray(this.period_type,this.year);
  }

  pushPeriodBackward(){
    this.year -= 1;
    this.periods = this.getPeriodArray(this.period_type,this.year);
  }

  changePeriodType(){
    this.periods = this.getPeriodArray(this.period_type,this.year);
  }

  //setting the period to next or previous
  setPeriod(type){
    if(type == "down"){
      this.periods = this.getPeriodArray(this.period_type, this.getLastPeriod(this.period.id,this.period_type).substr(0,4));
      this.activateNode(this.getLastPeriod(this.period.id,this.period_type), this.pertree);
      this.period = {
        id:this.getLastPeriod(this.period.id,this.period_type),
        name:this.getPeriodName(this.getLastPeriod(this.period.id,this.period_type))
      };

    }
    if(type == "up"){
      this.periods = this.getPeriodArray(this.period_type, this.getNextPeriod(this.period.id,this.period_type).substr(0,4));
      this.activateNode(this.getNextPeriod(this.period.id,this.period_type), this.pertree);
      this.period = {
        id:this.getNextPeriod(this.period.id,this.period_type),
        name:this.getPeriodName(this.getNextPeriod(this.period.id,this.period_type))
      };

    }
    setTimeout(() => {
      // this.loadScoreCard()
    }, 5);
  }

  // get the name of period to be used in a tittle
  getPeriodName(id){
    for ( let period of this.getPeriodArray(this.period_type, this.getLastPeriod(id,this.period_type).substr(0,4))){
      if( this.getLastPeriod(id,this.period_type) == period.id){
        return period.name;
      }
    }
  }


  // display period Tree
  displayPerTree(){
    if(!this.disabled) {
      this.showPerTree = !this.showPerTree;
    }
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
    this.displayPerTree();
    this.onPeriodUpdate.emit({name: 'pe', value: this.getPeriodsForAnalytics(this.selected_periods)});
  }

  getPeriodsForAnalytics(selectedPeriod) {
    let periodForAnalytics = "";
    selectedPeriod.forEach((periodValue, periodIndex) => {
      periodForAnalytics += periodIndex == 0 ? periodValue.id : ';' + periodValue.id;
    });
    return periodForAnalytics
  }

  getPeriodArray(type,year){
    let periods = [];
    if(type == "Weekly"){
      periods.push({id:'',name:''})
    }else if(type == "Monthly"){
      periods.push({id:year+'01',name:'January '+year,selected:true},{id:year+'02',name:'February '+year},{id:year+'03',name:'March '+year},{id:year+'04',name:'April '+year},{id:year+'05',name:'May '+year},{id:year+'06',name:'June '+year},{id:year+'07',name:'July '+year},{id:year+'08',name:'August '+year},{id:year+'09',name:'September '+year},{id:year+'10',name:'October '+year},{id:year+'11',name:'November '+year},{id:year+'12',name:'December '+year})
    }else if(type == "BiMonthly"){
      periods.push({id:year+'01B',name:'January - February '+year,selected:true},{id:year+'02B',name:'March - April '+year},{id:year+'03B',name:'May - June '+year},{id:year+'04B',name:'July - August '+year},{id:year+'05B',name:'September - October '+year},{id:year+'06B',name:'November - December '+year})
    }else if(type == "Quarterly"){
      periods.push({id:year+'Q1',name:'January - March '+year,selected:true},{id:year+'Q2',name:'April - June '+year},{id:year+'Q3',name:'July - September '+year},{id:year+'Q4',name:'October - December '+year})
    }else if(type == "SixMonthly"){
      periods.push({id:year+'S1',name:'January - June '+year,selected:true},{id:year+'S2',name:'July - December '+year})
    }else if(type == "SixMonthlyApril"){
      let useYear = parseInt(year) + 1;
      periods.push({id:year+'AprilS2',name:'October '+year+' - March '+useYear,selected:true},{id:year+'AprilS1',name:'April - September '+year})
    }else if(type == "FinancialOct"){
      for (var i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        let currentYear = useYear + 1;
        periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+ currentYear})
      }
    }else if(type == "Yearly"){
      for (var i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        periods.push({id:useYear,name:useYear})

      }
    }else if(type == "FinancialJuly"){
      for (var i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        let currentYear = useYear + 1;
        periods.push({id:useYear+'July',name:'July '+useYear+' - June '+ currentYear})
      }
    }else if(type == "FinancialApril"){
      for (var i = 0; i <= 10; i++) {
        let useYear = parseInt(year) - i;
        let currentYear = useYear + 1;
        periods.push({ id:useYear+'April',name:'April '+useYear+' - March '+ currentYear })
      }
    }else if(type == "Relative Weeks"){
      periods.push({id:'THIS_WEEK',name:'This Week'},{id:'LAST_WEEK',name:'Last Week'},{id:'LAST_4_WEEK',name:'Last 4 Weeks',selected:true},{id:'LAST_12_WEEK',name:'last 12 Weeks'},{id:'LAST_52_WEEK',name:'Last 52 weeks'});
    }else if(type == "Relative Month"){
      periods.push({id:'THIS_MONTH',name:'This Month'},{id:'LAST_MONTH',name:'Last Month'},{id:'LAST_3_MONTHS',name:'Last 3 Month'},{id:'LAST_6_MONTHS',name:'Last 6 Month'},{id:'LAST_12_MONTHS',name:'Last 12 Month',selected:true});
    }else if(type == "Relative Bi-Month"){
      periods.push({id:'THIS_BIMONTH',name:'This Bi-month'},{id:'LAST_BIMONTH',name:'Last Bi-month'},{id:'LAST_6_BIMONTHS',name:'Last 6 bi-month',selected:true});
    }else if(type == "Relative Quarter"){
      periods.push({id:'THIS_QUARTER',name:'This Quarter'},{id:'LAST_QUARTER',name:'Last Quarter'},{id:'LAST_4_QUARTERS',name:'Last 4 Quarters',selected:true});
    }else if(type == "Relative Six Monthly"){
      periods.push({id:'THIS_SIX_MONTH',name:'This Six-month'},{id:'LAST_SIX_MONTH',name:'Last Six-month'},{id:'LAST_2_SIXMONTHS',name:'Last 2 Six-month',selected:true});
    }else if(type == "Relative Year"){
      periods.push({id:'THIS_FINANCIAL_YEAR',name:'This Year'},{id:'LAST_FINANCIAL_YEAR',name:'Last Year',selected:true},{id:'LAST_5_FINANCIAL_YEARS',name:'Last 5 Years'});
    }else if(type == "Relative Financial Year"){
      periods.push({id:'THIS_YEAR',name:'This Financial Year'},{id:'LAST_YEAR',name:'Last Financial Year',selected:true},{id:'LAST_5_YEARS',name:'Last 5 Five financial years'});
    }
    return periods;
  }

  getLastPeriod(period: any, period_type:string ="Quarterly" ):any{
    if(period_type == "Weekly"){

    }
    else if(period_type == "Monthly"){
      let year = period.substring(0,4);
      let month = period.substring(4,6);
      let time = "";
      if(month == "02"){
        time = year+"01";
      }else if(month == "03"){
        time = year+"02";
      }else if(month == "04"){
        time = year+"03";
      }else if(month == "05"){
        time = year+"04";
      }else if(month == "06"){
        time = year+"05";
      }else if(month == "07"){
        time = year+"06";
      }else if(month == "08"){
        time = year+"07";
      }else if(month == "09"){
        time = year+"08";
      }else if(month == "10"){
        time = year+"09";
      }else if(month == "11"){
        time = year+"10";
      }else if(month == "12"){
        time = year+"11";
      }else if(month == "01"){
        let yr = parseInt(year)-1;
        time = yr+"12";
      }
      return time;
    }
    else if(period_type == "BiMonthly"){
      let year = period.substring(0,4);
      let month = period.substring(4,6);
      let time = "";
      if(month == "02"){
        time = year+"01B";
      }else if(month == "03"){
        time = year+"02B";
      }else if(month == "04"){
        time = year+"03B";
      }else if(month == "05"){
        time = year+"04B";
      }else if(month == "06"){
        time = year+"05B";
      }else if(month == "01"){
        let yr = parseInt(year)-1;
        time = yr+"06B";
      }
      return time;
    }
    else if(period_type == "Quarterly"){
      let year = period.substring(0,4);
      let quater = period.substring(4,6);
      let time = "";
      if(quater == "Q4"){
        time = year+"Q3";
      }else if(quater == "Q3"){
        time = year+"Q2";
      }else if(quater == "Q2"){
        time = year+"Q1";
      }else if(quater == "Q1"){
        let yr = parseInt(year)-1;
        time = yr+"Q4";
      }
      return time;
    }
    else if(period_type == "SixMonthly"){
      let year = period.substring(0,4);
      let six_month = period.substring(4,6);
      let time = "";
      if(six_month == "S1"){
        let yr = parseInt(year)-1;
        time = yr+"S2";
      }else if(six_month == "S2"){
        time = year+"S1"
      }
      return time;
    }
    else if(period_type == "SixMonthlyApril"){
      let year = period.substring(0,4);
      let six_month = period.substring(4,12);
      console.log(period.substring(4,12))
      let time = "";
      if(six_month == "AprilS2"){
        time = year+"AprilS1"
      }else if(six_month == "AprilS1"){
        let yr = parseInt(year)-1;
        time = yr+"AprilS2";
      }
      return time;
    }
    else if(period_type == "FinancialOct"){
      let year = period.substring(0,4);
      let last_year = parseInt(year) - 1;
      return last_year+"Oct"
    }
    else if(period_type == "Yearly"){
      return parseInt(period)-1;
    }
    else if(period_type == "FinancialJuly"){
      let year = period.substring(0,4);
      let last_year = parseInt(year) - 1;
      return last_year+"July"
    }
    else if(period_type == "FinancialApril"){
      let year = period.substring(0,4);
      let last_year = parseInt(year) - 1;
      return last_year+"April"
    }


  }

  getNextPeriod(period: any, period_type:string ="Quarterly"):any{
    if(period_type == "Weekly"){

    }
    else if(period_type == "Monthly"){
      let year = period.substring(0,4);
      let month = period.substring(4,6);
      let time = "";
      if(month == "02"){
        time = year+"03";
      }else if(month == "03"){
        time = year+"04";
      }else if(month == "04"){
        time = year+"05";
      }else if(month == "05"){
        time = year+"06";
      }else if(month == "06"){
        time = year+"07";
      }else if(month == "07"){
        time = year+"08";
      }else if(month == "08"){
        time = year+"09";
      }else if(month == "09"){
        time = year+"10";
      }else if(month == "10"){
        time = year+"11";
      }else if(month == "11"){
        time = year+"12";
      }else if(month == "12"){
        let yr = parseInt(year)+1;
        time = yr+"01";
      }else if(month == "01"){
        time = year+"02";
      }
      return time;
    }
    else if(period_type == "BiMonthly"){
      let year = period.substring(0,4);
      let month = period.substring(4,6);
      let time = "";
      if(month == "02"){
        time = year+"03B";
      }else if(month == "03"){
        time = year+"04B";
      }else if(month == "04"){
        time = year+"05B";
      }else if(month == "05"){
        time = year+"06B";
      }else if(month == "06"){
        let yr = parseInt(year)+1;
        time = yr+"01B";
      }else if(month == "01"){
        time = year+"02B";
      }
      return time;
    }
    else if(period_type == "Quarterly"){
      let year = period.substring(0,4);
      let quater = period.substring(4,6);
      let time = "";
      if(quater == "Q1"){
        time = year+"Q2";
      }else if(quater == "Q3"){
        time = year+"Q4";
      }else if(quater == "Q2"){
        time = year+"Q3";
      }else if(quater == "Q4"){
        let yr = parseInt(year)+1;
        time = yr+"Q1";
      }
      return time;
    }
    else if(period_type == "SixMonthly"){
      let year = period.substring(0,4);
      let six_month = period.substring(4,6);
      let time = "";
      if(six_month == "S2"){
        let yr = parseInt(year)+1;
        time = yr+"S1";
      }else if(six_month == "S1"){
        time = year+"S2"
      }
      return time;
    }
    else if(period_type == "SixMonthlyApril"){
      let year = period.substring(0,4);
      let six_month = period.substring(4,12);
      let time = "";
      if(six_month == "AprilS2"){
        let yr = parseInt(year)+1;
        time = yr+"AprilS1";
      }else if(six_month == "AprilS1"){
        time = year+"AprilS2"
      }
      return time;
    }
    else if(period_type == "FinancialOct"){
      let year = period.substring(0,4);
      let last_year = parseInt(year) + 1;
      return last_year+"Oct"
    }
    else if(period_type == "Yearly"){
      return parseInt(period)+1;
    }
    else if(period_type == "FinancialJuly"){
      let year = period.substring(0,4);
      let last_year = parseInt(year) + 1;
      return last_year+"July"
    }
    else if(period_type == "FinancialApril"){
      let year = period.substring(0,4);
      let last_year = parseInt(year) + 1;
      return last_year+"April"
    }
  }

  closeFilter() {
    this.showPerTree = false;
  }

}
