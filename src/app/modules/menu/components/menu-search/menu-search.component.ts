import { Component, OnInit, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import * as fromServices from '../../services';

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.css'],
  animations: [
    trigger('slide', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          transform: 'translateY(-100%)'
        }),
        animate(500)
      ]),
      transition('* => void', [
        animate(400),
        style({
          transform: 'translateY(-100%)'
        })
      ])
    ])
  ]
})
export class MenuSearchComponent implements OnInit {
  @Input() rootUrl: string;
  searchWidth: number;
  showApps: boolean;
  apps: any[];
  originalApps: any[];
  loadingModules: boolean;
  filteredApp: string;
  constructor(private menuService: fromServices.MenuService) {
    this.rootUrl = '../../../';
    this.searchWidth = 30;
    this.showApps = false;
    this.apps = [];
    this.originalApps = [];
    this.loadingModules = true;
    this.filteredApp = '';
  }

  ngOnInit() {
    this.menuService
      .getMenuModules(this.rootUrl)
      .subscribe((menuModules: any) => {
        if (menuModules !== null) {
          this.loadingModules = false;
          this.originalApps = [...menuModules];
          this.apps = this._prepareMenuModules();
        }
      });
  }

  private _prepareMenuModules() {
    return this.filteredApp === ''
      ? this.originalApps.filter((menu: any) => {
          return !menu.onlyShowOnSearch;
        })
      : this.originalApps;
  }

  updateMenuModules() {
    this.apps = this._prepareMenuModules();
  }

  widdenSearch(e?) {
    if (e) {
      e.stopPropagation();
    }
    document.getElementById('menu-search-input').focus();
    this.searchWidth = 57;
    this.showApps = true;
  }

  reduceSearch(e?) {
    if (e) {
      e.stopPropagation();
    }
    document.getElementById('menu-search-input').blur();
    this.searchWidth = 30;
    this.showApps = false;
  }

  toggleSearch(e) {
    e.stopPropagation();
    if (this.showApps) {
      this.reduceSearch();
    } else {
      this.widdenSearch();
    }
  }
}
