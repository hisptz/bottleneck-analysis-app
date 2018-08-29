import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { generateUid } from '../../../helpers/generate-uid.helper';

@Component({
  selector: 'app-intervention-form',
  templateUrl: './intervention-form.component.html',
  styleUrls: ['./intervention-form.component.scss']
})
export class InterventionFormComponent implements OnInit {
  @Input()
  interventionId: string;
  @Input()
  interventionName: string;

  @Output()
  save: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.interventionId = generateUid();
    this.interventionName = 'Untitled';
  }

  ngOnInit() {}

  onEnterInterventionName(e) {
    e.stopPropagation();
    this.interventionName = e.target.value.trim();
  }
  onSaveIntervention(e) {
    e.stopPropagation();
    this.save.emit({ id: this.interventionId, name: this.interventionName });
  }

  onCloseInterventionForm(e) {
    e.stopPropagation();
    this.close.emit({ id: this.interventionId, name: this.interventionName });
  }
}
