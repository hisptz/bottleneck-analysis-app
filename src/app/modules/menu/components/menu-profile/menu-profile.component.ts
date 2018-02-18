import { Component, OnInit, Input } from '@angular/core';
import * as fromServices from '../../services';
import * as fromConstants from '../../constants';

@Component({
  selector: 'app-menu-profile',
  templateUrl: './menu-profile.component.html',
  styleUrls: ['./menu-profile.component.css']
})
export class MenuProfileComponent implements OnInit {
  @Input() rootUrl: string;
  showProfile: boolean;
  currentUser: any;
  loadingUser: boolean;
  profileMenus: any[];
  constructor(private menuService: fromServices.MenuService) {
    this.showProfile = false;
    this.rootUrl = '../../../';
    this.loadingUser = true;
    this.profileMenus = fromConstants.PROFILE_MENUS;
  }

  ngOnInit() {
    this.menuService.getUserInfo(this.rootUrl).subscribe((profile: any) => {
      if (profile) {
        this.currentUser = {
          name: profile.displayName,
          email: profile.email,
        };
      }
      this.loadingUser = false;
    });
  }

  showMenuProfile(e) {
    e.stopPropagation();
    this.showProfile = true;
  }

  hideMenuProfile(e?) {
    if (e) {
      e.stopPropagation();
    }

    this.showProfile = false;
  }
}
