import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  showAlert: boolean =  false;
  notification: any = {};
  constructor() { }

  setNotification(status, message) {
    this.notification = {status: status, message: message};
    this.showAlert = true;
  }

  closeAlert() {
    this.notification = {};
    this.showAlert = false;
  }

  hasAlert() {
    return this.showAlert;
  }

}
