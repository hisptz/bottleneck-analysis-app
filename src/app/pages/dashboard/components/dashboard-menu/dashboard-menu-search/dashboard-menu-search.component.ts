import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-dashboard-menu-search',
  templateUrl: './dashboard-menu-search.component.html',
  styleUrls: ['./dashboard-menu-search.component.css']
})
export class DashboardMenuSearchComponent implements OnInit {

  showDashboardSearch: boolean;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  toggleDashboardMenuSearch(e?) {

    if (e) {
      e.stopPropagation();
    }

    this.showDashboardSearch = !this.showDashboardSearch;

    if (!this.showDashboardSearch) {
      this.onSearch.emit('');
    }
  }

  onSearchTermChange(e) {
    e.stopPropagation();
    this.onSearch.emit(e.target.value);
  }

}
