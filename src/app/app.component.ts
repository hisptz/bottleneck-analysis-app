import { Component } from '@angular/core';
import { NgxDhis2HttpClientService } from 'ngx-dhis2-http-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: NgxDhis2HttpClientService) {
    this.http.get('me.json').subscribe((user) => {
      console.log(user);
    });
  }
}
