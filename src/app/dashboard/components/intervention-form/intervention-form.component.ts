import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { generateUid } from '../../../helpers/generate-uid.helper';
import { Intervention } from '../../store/models/intervention.model';

@Component({
  selector: 'app-intervention-form',
  templateUrl: './intervention-form.component.html',
  styleUrls: ['./intervention-form.component.scss']
})
export class InterventionFormComponent implements OnInit {
  @Input()
  intervention: Intervention;

  @Input()
  availableInterventions: any[];

  interventionName: string;

  @Output()
  save: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.intervention = { id: generateUid(), name: 'Untitled' };
  }

  get isNotUnique() {
    return _.some(
      this.availableInterventions || [],
      intervention =>
        intervention &&
        intervention.name &&
        intervention.id &&
        intervention.name.toLowerCase() ===
          (this.interventionName || '').toLowerCase() &&
        intervention.id !== this.intervention.id
    );
  }

  ngOnInit() {
    this.interventionName = this.intervention.name;
  }

  onEnterInterventionName(e) {
    e.stopPropagation();
    this.interventionName = e.target.value.trim();
  }
  onSaveIntervention(e) {
    e.stopPropagation();
    this.save.emit({ ...this.intervention, name: this.interventionName });
  }

  onCloseInterventionForm(e) {
    e.stopPropagation();
    this.close.emit(this.intervention);
  }
}
