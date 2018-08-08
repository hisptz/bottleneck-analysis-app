import { Component, OnInit, Input } from '@angular/core';
import { openAnimation } from '../../../../../animations';

@Component({
  selector: 'app-visualization-management-section',
  templateUrl: './visualization-management-section.component.html',
  styleUrls: ['./visualization-management-section.component.scss'],
  animations: [openAnimation]
})
export class VisualizationManagementSectionComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  showManagementPanel: boolean;
  constructor() {}

  ngOnInit() {
    this.showManagementPanel = false;
  }

  onToggleManagementPanel(e) {
    e.stopPropagation();
    this.showManagementPanel = !this.showManagementPanel;
  }

  onInputChange(e, field: string) {
    e.stopPropagation();
    console.log(e.target.value);
    if (field === 'NAME') {
      this.name = e.target.value.trim('');
    } else {
      this.description = e.target.value.trim('');
    }
  }
}
