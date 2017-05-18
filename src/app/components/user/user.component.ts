import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {Visualization} from "../../model/visualization";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnChanges {

  @Input() userData: Visualization;
  loading: boolean = true;
  users: any[] = [];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.loading = true;
    if(this.userData != undefined) {
      this.users = this.userData.layers[0].settings.users;
      this.loading = false;
    }
  }

}
