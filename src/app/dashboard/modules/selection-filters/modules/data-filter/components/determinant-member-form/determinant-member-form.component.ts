import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Determinant } from 'src/app/models';

@Component({
  selector: 'app-determinant-member-form',
  templateUrl: './determinant-member-form.component.html',
  styleUrls: ['./determinant-member-form.component.scss'],
})
export class DeterminantMemberFormComponent implements OnInit {
  @Input() determinantMember: any;
  @Input() determinant: Determinant;
  @Input() generalDataConfiguration: any;

  @Output() removeMember: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateMember: EventEmitter<any> = new EventEmitter<any>();

  isFormOpen: boolean;
  constructor() {}

  get memberLabel(): string {
    return this.determinantMember
      ? this.generalDataConfiguration.useShortNameAsLabel
        ? this.determinantMember.shortName
        : this.determinantMember.label
      : this.determinantMember.shortName;
  }

  ngOnInit() {}

  onRemoveMember(determinant: Determinant, member: any, e) {
    e.stopPropagation();
    this.removeMember.emit({ dataItem: member, determinant: determinant });
  }

  onToggleForm(e) {
    e.stopPropagation();
    this.isFormOpen = !this.isFormOpen;
  }

  onInputChange(e, attribute: string) {
    e.stopPropagation();
    this.updateMember.emit({
      ...this.determinantMember,
      [attribute]: e.target ? e.target.value : this.determinantMember.label,
    });
  }
}
