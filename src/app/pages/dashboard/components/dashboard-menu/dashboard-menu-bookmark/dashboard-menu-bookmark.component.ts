import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-dashboard-menu-bookmark',
  templateUrl: './dashboard-menu-bookmark.component.html',
  styleUrls: ['./dashboard-menu-bookmark.component.css']
})
export class DashboardMenuBookmarkComponent implements OnInit {

  @Input() showBookmarked: boolean;

  @Output() onToggleBookmark: EventEmitter<any> = new EventEmitter<any>();
  constructor() {

  }

  ngOnInit() {
  }

  toggleBookmarked(e) {
    e.stopPropagation();
    this.onToggleBookmark.emit(null);
  }

}
