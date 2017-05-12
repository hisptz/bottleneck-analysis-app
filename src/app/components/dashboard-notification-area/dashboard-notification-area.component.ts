import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard-notification-area',
  templateUrl: './dashboard-notification-area.component.html',
  styleUrls: ['./dashboard-notification-area.component.css']
})
export class DashboardNotificationAreaComponent implements OnInit {

  loading: boolean = true;
  hasError: boolean = false;
  errorMessage: string;
  notification: any;
  constructor(
    private http: Http
  ) { }

  ngOnInit() {
    this.loadNotification();
  }

  loadNotification() {
    this.http.get('../../../api/me/dashboard.json')
      .map(res => res.json())
      .catch(error => Observable.throw(new Error(error)))
      .subscribe(notification => {
          this.notification = notification;
          this.loading = false;
          this.updateNotification();
        },
        error => {
          this.hasError = true;
          this.loading = true;
          this.errorMessage = error.message;
        });
  }

  private updateNotification(): void {
    Observable.timer(60000).first().subscribe(() => this.loadNotification());
  }

}
