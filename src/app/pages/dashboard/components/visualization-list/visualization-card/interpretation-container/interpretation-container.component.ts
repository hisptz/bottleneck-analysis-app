import {Component, Input, OnInit} from '@angular/core';
import {CurrentUserState} from '../../../../../../store/current-user/current-user.state';

@Component({
  selector: 'app-interpretation-container',
  templateUrl: './interpretation-container.component.html',
  styleUrls: ['./interpretation-container.component.css']
})
export class InterpretationContainerComponent implements OnInit {

  @Input() visualizationLayers: any[];
  @Input() currentUser: CurrentUserState;
  @Input() itemHeight: string;
  constructor() { }

  ngOnInit() {
  }

}
