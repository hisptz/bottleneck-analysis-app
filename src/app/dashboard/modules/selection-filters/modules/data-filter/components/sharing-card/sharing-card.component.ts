import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sharing-card',
  templateUrl: './sharing-card.component.html',
  styleUrls: ['./sharing-card.component.scss'],
})
export class SharingCardComponent implements OnInit {
  @Input() userAndUserGroups: any[] = [];
  showSharing: boolean;
  sharingAccesses: any[];
  constructor() {
    this.sharingAccesses = [
      {
        name: 'Can view and edit',
        access: 'rw------',
      },
      {
        name: 'Can View Only',
        access: 'r-------',
      },
    ];
  }

  ngOnInit() {}

  onToggleSharing(e) {
    e.stopPropagation();
    this.showSharing = !this.showSharing;
  }

  onAddSharingItem(sharingItem: any) {
    console.log(sharingItem);
  }
}
