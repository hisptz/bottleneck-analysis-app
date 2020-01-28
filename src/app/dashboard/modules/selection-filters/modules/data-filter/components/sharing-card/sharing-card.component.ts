import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Input() userAccesses: any[];
  @Input() userGroupAccesses: any[];
  @Input() publicAccess: string;
  showSharing: boolean;
  sharingAccesses: any[];
  sharingAccessEnum: any;
  sharingList: any[];

  @Output() updateSharing: EventEmitter<any> = new EventEmitter<any>();
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
      {
        name: 'No Access',
        access: SharingAccess.NO_ACCESS,
      },
    ];
  }

  get sharingItems(): any[] {
    return [
      {
        id: 'public',
        type: 'publicAccess',
        name: 'Public',
        access: this.publicAccess,
      },
      ...this.userAccesses,
      ...this.userGroupAccesses,
    ];
  }

  get sharingSummary(): string {
    if (this.publicAccess !== SharingAccess.NO_ACCESS) {
      return 'Everyone';
    }
    const summary =
      this.publicAccess === SharingAccess.NO_ACCESS ? 'You' : 'Everyone';

    const otherCount = (this.sharingItems || []).length - 1;

    return otherCount > 0 ? `${summary} and ${otherCount} more` : summary;
  }

  ngOnInit() {
    this.sharingAccessEnum = SharingAccess;
  }

  onToggleSharing(e) {
    e.stopPropagation();
    this.showSharing = !this.showSharing;
  }

  onAddSharingItem(sharingItem: any) {
    switch (sharingItem.type) {
      case 'user': {
        this.updateSharing.emit({
          userAccesses: [
            ...(this.userAccesses || []),
            {
              ...sharingItem,
              access: SharingAccess.CAN_VIEW_ONLY,
            },
          ],
        });
        break;
      }
      case 'userGroup': {
        this.updateSharing.emit({
          userGroupAccesses: [
            ...(this.userGroupAccesses || []),
            {
              ...sharingItem,
              access: SharingAccess.CAN_VIEW_ONLY,
            },
          ],
        });
        break;
      }
    }
  }

  onRemoveSharingItem(e, sharingItem: any) {
    e.stopPropagation();
    switch (sharingItem.type) {
      case 'user': {
        this.updateSharing.emit({
          userAccesses: (this.userAccesses || []).filter(
            (userAccess: any) => userAccess.id !== sharingItem.id
          ),
        });
        break;
      }
      case 'userGroup': {
        this.updateSharing.emit({
          userGroupAccesses: (this.userGroupAccesses || []).filter(
            (userGroupAccess: any) => userGroupAccess.id !== sharingItem.id
          ),
        });
        break;
      }
    }
  }

  onUpdateSharingAccess(e, sharingItem: any, sharingAccess: any) {
    e.stopPropagation();

    switch (sharingItem.type) {
      case 'user': {
        this.updateSharing.emit({
          userAccesses: (this.userAccesses || []).map((userAccess: any) => {
            if (sharingItem.id === userAccess.id) {
              return { ...userAccess, access: sharingAccess.access };
            }

            return userAccess;
          }),
        });
        break;
      }
      case 'userGroup': {
        this.updateSharing.emit({
          userGroupAccesses: (this.userGroupAccesses || []).map(
            (userGroupAccess: any) => {
              if (sharingItem.id === userGroupAccess.id) {
                return { ...userGroupAccess, access: sharingAccess.access };
              }

              return userGroupAccess;
            }
          ),
        });
        break;
      }

      case 'publicAccess': {
        this.updateSharing.emit({ publicAccess: sharingAccess.access });
      }
    }
  }
  trackByFn(id: string, item: any) {
    return id;
  }
}
