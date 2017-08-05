import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  constructor() { }

  ngOnInit() {
  }

}
