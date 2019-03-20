import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { openAnimation } from '../../../../../animations';

@Component({
  selector: 'app-visualization-management-section',
  templateUrl: './visualization-management-section.component.html',
  styleUrls: ['./visualization-management-section.component.scss'],
  animations: [openAnimation]
})
export class VisualizationManagementSectionComponent implements OnInit {
  @Input()
  name: string;
  @Input()
  description: string;

  @Input()
  savingFavorite: boolean;

  @Input()
  hideManagementBlock: boolean;
  @Output()
  save: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  remove: EventEmitter<any> = new EventEmitter<any>();
  showManagementPanel: boolean;
  showDeleteConfirmation: boolean;
  deleteFavorite: boolean;
  constructor() {
    this.deleteFavorite = false;
  }

  ngOnInit() {
    this.showManagementPanel = false;
    this.showDeleteConfirmation = false;
  }

  onToggleManagementPanel(e) {
    e.stopPropagation();
    this.showManagementPanel = !this.showManagementPanel;
  }

  onInputChange(e, field: string) {
    e.stopPropagation();
    if (field === 'NAME') {
      this.name = e.target.value.trim('');
    } else {
      this.description = e.target.value.trim('');
    }
  }

  onSave(e) {
    e.stopPropagation();
    this.showManagementPanel = false;
    this.save.emit({
      name: this.name,
      description: this.description
    });
  }

  onRemove(e) {
    e.stopPropagation();
    this.showManagementPanel = false;
    this.showDeleteConfirmation = true;
  }

  onDeleteCancel(e) {
    e.stopPropagation();
    this.showDeleteConfirmation = false;
  }

  onConfirmDelete(e) {
    e.stopPropagation();
    this.remove.emit({
      deleteFavorite: this.deleteFavorite
    });
    this.deleteFavorite = false;
    this.showDeleteConfirmation = false;
  }
}
