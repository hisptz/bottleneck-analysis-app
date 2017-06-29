import {Component, OnInit, Input} from '@angular/core';
import {Response, Http} from "@angular/http";
import {Observable} from "rxjs";
import {FilterPipe} from "./filter.pipe";

export const PROFILE_MENUS = [{
  name: "Settings",
  namespace: "/dhis-web-user-profile",
  defaultAction: "/dhis-web-user-profile/#/settings",
  icon: "/icons/usersettings.png",
  description: ""
}, {
  name: "Profile",
  namespace: "/dhis-web-user-profile",
  defaultAction: "/dhis-web-user-profile/#/profile",
  icon: "/icons/function-profile.png",
  description: ""
}, {
  name: "Account",
  namespace: "/dhis-web-user-profile",
  defaultAction: "/dhis-web-user-profile/#/account",
  icon: "/icons/function-account.png",
  description: ""
}, {
  name: "Help",
  namespace: "/dhis-web-commons-about",
  defaultAction: "https://dhis2.github.io/dhis2-docs/master/en/user/html/dhis2_user_manual_en.html",
  icon: "/icons/function-account.png",
  description: ""
}, {
  name: "About Dhis2",
  namespace: "/dhis-web-commons-about",
  defaultAction: "/dhis-web-commons-about/about.action",
  icon: "/icons/function-about-dhis2.png",
  description: ""
}];

export const menuBackgroundColors = {
  green: '#467e4a',
  light_blue: '#276696',
  india: '#ea5911',
  myanmar: '#276696',
  vietnam:  '#b40303'
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [FilterPipe]
})
export class MenuComponent implements OnInit {

  @Input() root_dir: string = '../../../';
  backgroundColor: string = '#f5f5f5';
  applicationTitle: string;
  currentUser: any = {};
  searchWidth: number = 30;
  showApps: boolean = false;
  showProfile: boolean = false;
  apps: any[];
  profileMenus: any[] = PROFILE_MENUS;
  filteredApp: string = '';
  loadingModules: boolean = true;
  loadingUser: boolean = true;
  constructor(
    private http:  Http
  ) { }

  ngOnInit() {
    this.http.get(this.root_dir + 'api/userSettings.json')
      .map((response: Response) => response.json())
      .catch(this.handleError)
      .subscribe(settings => {

      });

    this.http.get(this.root_dir + 'api/systemSettings.json')
      .map((response: Response) => response.json())
      .catch(this.handleError)
      .subscribe(settings => {
        if(settings) {
          this.applicationTitle = settings['applicationTitle'];
          //get user current background style
          const colorName = settings.hasOwnProperty('currentStyle') ? settings['currentStyle'].split('/')[0] : settings.hasOwnProperty('keyStyle') ? settings['keyStyle'].split('/')[0] : 'blue';
          this.backgroundColor = menuBackgroundColors[colorName];
        }
      });

    this.http.get(this.root_dir + 'api/me.json')
      .map((response: Response) => response.json())
      .catch(this.handleError)
      .subscribe((profile: any) => {
        if(profile) {
          this.loadingUser = false;
          this.currentUser.name = profile.displayName;
          this.currentUser.email = profile.email;
          this.currentUser.AbbreviatedName = this.getAbbreviatedName(profile.displayName);
        }
      })

    this.http.get(this.root_dir + "dhis-web-commons/menu/getModules.action")
      .map((response: Response) => response.json())
      .catch(this.handleError)
      .subscribe((result: any) => {
        if(result) {
          this.loadingModules = false;
          this.apps = this.sanitizeMenuItems(result.modules);
        }
      })
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private getAbbreviatedName(name): string {
    let abbreviatedName: any = [];
    let count: number = 0;
    for(let i=0; i<=name.length-1;i++) {
      if(i == 0) {
        abbreviatedName.push(name[i].toUpperCase());
      } else {
        if(name[i] == ' ') {
          count = i;
          abbreviatedName.push(name[count+1].toUpperCase());
        }
      }
    }

    return abbreviatedName.join("");
  }

  private widdenSearch() {
    this.searchWidth = 80;
    this.showApps = !this.showApps;
  }

  reduceSearch() {
    document.getElementById('app-search').blur();
    this.searchWidth = 30;
    this.showApps = !this.showApps
  }

  sanitizeMenuItems(menuItems): any {
    menuItems.forEach(item => {
      if(!item.hasOwnProperty('displayName') || item.displayName == '') {
        item.displayName = item.name;
      }

      if(item.defaultAction.indexOf('http') == -1) {
        item.defaultAction = '../../' + item.defaultAction;
      }

      if(item.icon.indexOf('http') == -1) {
        item.icon = '../../' + item.icon;
      }
    });
    return menuItems;
  }

}


