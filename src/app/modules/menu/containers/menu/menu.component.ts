import { Component, OnInit } from '@angular/core';
import * as fromServices from '../../services';
import * as fromConstants from '../../constants';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(400),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class MenuComponent implements OnInit {
  rootUrl: string;
  applicationTitle: string;
  backgroundColor: string;
  menuLoading: boolean;
  menuLoadingFail: boolean;
  loggedIn: boolean;
  online: boolean;
  menuNotification: string;
  wasOffline: boolean;
  constructor(
    private menuService: fromServices.MenuService,
    private systemStatusService: fromServices.SystemStateService
  ) {
    this.rootUrl = '../../../';
    this.menuLoading = true;
    this.menuLoadingFail = false;
    this.loggedIn = true;
    this.online = false;
    this.menuNotification = '';
    this.wasOffline = true;
    this.backgroundColor = '#ECECEC';
  }

  ngOnInit() {
    this.getSystemSettings();
    /**
     * Check system status
     */
    this.systemStatusService
      .checkLoginStatus()
      .subscribe((loggingStatus: any) => {
        this.loggedIn = loggingStatus.loggedIn;
        this.online = loggingStatus.online;
        if (this.online) {
          if (this.wasOffline) {
            this.menuNotification = 'You are online';
            this.wasOffline = false;

            if (this.menuLoadingFail) {
              this.getSystemSettings();
            }

            setTimeout(() => {
              this.menuNotification = '';
            }, 8000);
          }
        } else {
          this.menuNotification = 'You are offline';
          this.wasOffline = true;
        }
      });
  }

  getSystemSettings() {
    this.menuService.getSystemSettings(this.rootUrl).subscribe(
      (settings: any) => {
        if (settings) {
          this.applicationTitle = settings['applicationTitle'];
          /**
           * get system current background style
           * @type {string}
           */
          const colorName = settings.hasOwnProperty('currentStyle')
            ? settings['currentStyle'].split('/')[0]
            : settings.hasOwnProperty('keyStyle')
              ? settings['keyStyle'].split('/')[0]
              : 'blue';
          this.backgroundColor =
            fromConstants.MENU_BACKGROUND_COLORS[colorName];
        }
        this.menuLoading = false;
        this.menuLoadingFail = false;
      },
      () => {
        this.menuLoading = false;
        this.menuLoadingFail = true;
      }
    );
  }
}
