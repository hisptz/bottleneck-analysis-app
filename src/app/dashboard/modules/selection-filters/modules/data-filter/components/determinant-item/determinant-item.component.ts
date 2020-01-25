import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-determinant-item',
  templateUrl: './determinant-item.component.html',
  styleUrls: ['./determinant-item.component.scss'],
})
export class DeterminantItemComponent implements OnInit {
  @Input()
  determinant: any;

  @Input()
  determinants: any[];

  @Output()
  updateDeterminant: EventEmitter<any> = new EventEmitter<any>();

  newDeterminantName: string;
  constructor() {}

  get isUnique() {
    return !this.newDeterminantName
      ? false
      : _.some(
          this.determinants || [],
          (determinant: any) =>
            determinant &&
            determinant.name &&
            determinant.id &&
            determinant.name.toLowerCase() ===
              (this.newDeterminantName || '').toLowerCase() &&
            determinant.id !== this.determinant.id
        );
  }

  ngOnInit() {
    if (this.determinant) {
      this.newDeterminantName = this.determinant.name;
    }
  }

  onDeterminantNameChange(e) {
    e.stopPropagation();
    this.newDeterminantName = e.target.value;
    this.emitDeterminant();
  }

  emitDeterminant() {
    if (!this.isUnique) {
      this.updateDeterminant.emit({
        ...this.determinant,
        name: this.newDeterminantName,
      });
    }
  }
}
