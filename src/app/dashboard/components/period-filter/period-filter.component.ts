import {Component, OnInit, forwardRef, Output, Input, EventEmitter} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PeriodFilterComponent),
  multi: true
};

@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.css']
})
export class PeriodFilterComponent implements OnInit {

  private onChangeCallback: (_: any) => void = noop;
  //get accessor
  get value(): any {
    return this.isOpen;
  }
  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.isOpen) {
      this.isOpen = v;
      this.onChangeCallback(v);
    }
  }
  writeValue(value:any):void {
    if (value !== this.isOpen) {
      this.isOpen = value;
    }
  }

  registerOnChange(fn:any):void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn:any):void {

  }

  setDisabledState(isDisabled:boolean):void {

  }

  @Output() periodSelected = new EventEmitter();
  isDropDownOpen;


  @Input() isOpen;

  @Output() isOpenChange = new EventEmitter();
  isOpenMenu(val){
    this.isOpen = val;
    this.isOpenChange.emit(this.isOpen);
  }

  periods = [];

  constructor(private route:ActivatedRoute, private router:Router) {
    this.router.events.subscribe((val:any) => {
      this.checkPeriod();

    })
  }

  ngOnInit() {
    this.populateList();
    this.checkPeriod()
  }
  checkPeriod(){
    let period = this.router.url.substr(this.router.url.indexOf("period/") + 7);
    this.list.forEach((p)=>{
      if(p.value == period){
        this.selectedPeriod = p;
      }
    })
  }
  currentDate = new Date();
  periodType = "Monthly";
  periodTypeChanged(event){
    this.periodType = event;
    this.populateList();
  }
  populateList() {
    if (this.periodType == "Monthly") {
      this.populateMonthList();
    }else if(this.periodType == "Yearly"){
      this.populateYearList()
    }
  }

  next() {
    if (this.periodType == "Monthly") {
      this.currentDate = new Date(this.currentDate.getFullYear() + 1, this.currentDate.getMonth(), this.currentDate.getDate());
      this.populateList();
    }else if(this.periodType == "Yearly"){
      this.currentDate = new Date(this.currentDate.getFullYear() + 10, this.currentDate.getMonth(), this.currentDate.getDate());
      this.populateYearList()
    }

  }

  previous() {
    if (this.periodType == "Monthly") {
      this.currentDate = new Date(this.currentDate.getFullYear() - 1, this.currentDate.getMonth(), this.currentDate.getDate());
      this.populateList();
    }else if(this.periodType == "Yearly"){
      this.currentDate = new Date(this.currentDate.getFullYear() - 10, this.currentDate.getMonth(), this.currentDate.getDate());
      this.populateYearList()
    }
    this.allowNext = true;
  }

  allowNext = true;
  allowPrevious = true;
  list = [];

  populateMonthList() {
    //this.allowNext = true;
    var monthNames = [ "January", "February", "March", "April", "May", "June" ,"July", "August", "September", "October", "November", "December"];
    this.list = [];
    var year = this.currentDate.getFullYear();
    for(let i = 0;i < 3;i++){

      var monthVal = this.currentDate.getMonth() - i;
      console.log(monthVal);
      if (monthVal < 0) {
        monthVal = 12 + monthVal;
        year--;
      }
      let monthText = "";
      if ((monthVal + 1) < 10) {
        monthText = "0" + (monthVal + 1);
      }else{
        monthText = "" + (monthVal + 1);
      }
      this.list.unshift({
        name: monthNames[monthVal] + " " + year,
        value: year + "" + monthText
      })
    }
    this.list.reverse();
  }
  populateYearList() {
    this.list = [];
    var year = this.currentDate.getFullYear();
    for(let i = 0;i < 10;i++){
      this.list.push({
        name: year - i,
        value: year - i
      })
    }
    this.allowNext = false;
    this.list = this.list.splice(0,3);
  }
  model = "";
  selectedPeriod;
  select(period){
    this.selectedPeriod = period;
    this.periodSelected.emit(period.value);
    this.isOpen = false;
  }

}
