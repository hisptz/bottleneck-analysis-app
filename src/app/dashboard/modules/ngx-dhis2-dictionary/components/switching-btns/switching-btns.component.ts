import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switching-btns',
  templateUrl: './switching-btns.component.html',
  styleUrls: ['./switching-btns.component.css']
})
export class SwitchingBtnsComponent implements OnInit {

  @Input() metadataTypes: any;
  @Output() getActiveMetadataType = new EventEmitter<string>();
  activeType: string;
  constructor() {
    this.activeType = 'indicator';
   }

  ngOnInit() {
  }

  switchMetadata(type) {
    this.activeType = type
    this.getActiveMetadataType.emit(type)
  }
}
