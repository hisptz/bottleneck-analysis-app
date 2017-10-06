import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-multiselect',
  templateUrl: 'multiselect.component.html',
  styleUrls: ['multiselect.component.css']
})
export class MultiselectComponent implements OnInit {

  @Input() items: any[] = [];
  @Input() placeholder: string;
  @Input() startingItems: any[];
  @Input() selectedItems: any[];
  @Input() prefix: string;
  @Input() prefixMultiple: string;
  hideOptions: boolean;
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.startingItems = [];
    this.placeholder = 'Select';
    this.selectedItems = [];
    this.prefix = '';
    this.prefixMultiple = '';
    this.hideOptions = true;
  }

  ngOnInit() {
    if (this.startingItems.length !== 0) {
      if (this.selectedItems.length === 0) {
        this.selectedItems = this.startingItems;
      } else {
        this.startingItems.forEach((val: any) => {
          this.selectedItems.push(val);
        });
      }
      this.onSelected.emit(this.selectedItems);
    }
  }

  displayPerTree() {
    this.hideOptions = !this.hideOptions;
  }

  reset() {
    this.selectedItems = [];
    this.onSelected.emit(this.selectedItems);
  }

  checkItemAvailabilty(item, array): boolean {
    let checker = false;
    for (const per of array) {
      if (per.id === item.id) {
        checker = true;
      }
    }
    return checker;
  }

  selectItem(item) {
    if (this.checkItemAvailabilty(item, this.selectedItems)) {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    } else {
      this.selectedItems.push(item);
    }
    this.onSelected.emit(this.selectedItems);
  }

  deActivateNode(item, event) {
    this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
    this.onSelected.emit(this.selectedItems);
    event.stopPropagation();
  }

}
