import { Component } from '@angular/core';
import {Constants} from "./shared/constants";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rootUrl: string;
  constructor(private constants: Constants) {
    this.rootUrl = this.constants.root_url.slice(0,-1);
  }
}
