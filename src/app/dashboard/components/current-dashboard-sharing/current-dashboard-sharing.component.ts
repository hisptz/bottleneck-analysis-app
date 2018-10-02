import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { SHARE_ICON } from '../../../icons';
import { openAnimation } from '../../../animations';

@Component({
  selector: 'app-current-dashboard-sharing',
  templateUrl: './current-dashboard-sharing.component.html',
  styleUrls: ['./current-dashboard-sharing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [openAnimation]
})
export class CurrentDashboardSharingComponent implements OnInit {
  @Input()
  id: string;
  shareIcon: string;
  showShareBlock: boolean;
  constructor() {
    this.shareIcon = SHARE_ICON;
  }

  ngOnInit() {}

  toggleShareBlock(e?) {
    if (e) {
      e.stopPropagation();
    }

    this.showShareBlock = !this.showShareBlock;
  }
}
