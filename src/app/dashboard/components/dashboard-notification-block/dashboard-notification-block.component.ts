import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../../../shared/providers/notification.service";

@Component({
  selector: 'app-dashboard-notification-block',
  templateUrl: './dashboard-notification-block.component.html',
  styleUrls: ['./dashboard-notification-block.component.css']
})
export class DashboardNotificationBlockComponent implements OnInit {

  showAlert: boolean = true;
  notification: any;
  statusData: any = {
    className: '',
    icon: ''
  };
  message: string = '';
  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.statusData = this.getStatusClassAndIcon(this.notificationService.notification.status);
    this.message = this.notificationService.notification.message;
  }

  getStatusClassAndIcon(status) {
    let statusData: any = {};
    if(status == 'success') {
      statusData = {
        className: 'alert-success',
        icon: 'fa-check-circle'
      }
    } else if (status == 'error') {
      statusData = {
        className: 'alert-danger',
        icon: 'fa-exclamation-triangle'
      }
    } else if(status == 'warning') {
      statusData = {
        className: 'alert-warning',
        icon: 'fa-exclamation-triangle'
      }
    } else if(status == 'info') {
      statusData = {
        className: 'alert-info',
        icon: 'fa-info-circle'
      }
    }

    return statusData;
  }

}
