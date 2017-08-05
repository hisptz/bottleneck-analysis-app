import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  private _users: any[];
  constructor() {

  }

  ngOnInit() {
    this._users = this.visualizationObject.layers[0].settings.users;
  }


  get users(): any[] {
    return this._users;
  }

  set users(value: any[]) {
    this._users = value;
  }
}
