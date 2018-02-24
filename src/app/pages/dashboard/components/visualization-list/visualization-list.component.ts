import {Component, Input, OnInit} from '@angular/core';
import { Visualization } from '../../../../store/visualization/visualization.state';
import { CurrentUserState } from '../../../../store/current-user/current-user.state';

@Component({
  selector: 'app-visualization-list',
  templateUrl: './visualization-list.component.html',
  styleUrls: ['./visualization-list.component.css']
})
export class VisualizationListComponent implements OnInit {
  @Input() visualizationObjects: Visualization[];
  @Input() currentUser: CurrentUserState;
  constructor() {
  }

  ngOnInit() {}
}
