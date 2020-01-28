import { Component, OnInit, Input } from '@angular/core';

enum SharingAccess {
  CAN_EDIT = 'rw------',
  CAN_VIEW_ONLY = 'r-------',
  NO_ACCESS = '--------',
}

@Component({
  selector: 'app-sharing-card',
  templateUrl: './sharing-card.component.html',
  styleUrls: ['./sharing-card.component.scss'],
})
export class SharingCardComponent implements OnInit {
  @Input() usersAccesses: any[];
  @Input() userGroupsAccesses: any[];
  @Input() publicAccess: string;
  showSharing: boolean;
  sharingAccesses: any[];
  sharingAccessEnum: any;
  constructor() {
    this.sharingAccesses = [
      {
        name: 'Can view and edit',
        access: SharingAccess.CAN_EDIT,
      },
      {
        name: 'Can View Only',
        access: SharingAccess.CAN_VIEW_ONLY,
      },
    ];
  }

  get sharingItems(): any[] {
    return [{ id: 'public', name: 'Public', access: this.publicAccess }];
  }

  ngOnInit() {
    console.log(this.userGroupsAccesses, this.usersAccesses, this.publicAccess);
    this.sharingAccessEnum = SharingAccess;
  }

  onToggleSharing(e) {
    e.stopPropagation();
    this.showSharing = !this.showSharing;
  }

  onAddSharingItem(sharingItem: any) {
    console.log(sharingItem);
  }
  trackByFn(id: string, item: any) {
    return id;
  }
}
